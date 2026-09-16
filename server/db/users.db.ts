import { pool } from './pool'
import type { IPagedResult, IUser, IUserRow, IUserSearchParams, UserRole } from '../types'

const toUser = (row: IUserRow): IUser => ({
  id: row.id,
  login: row.login,
  role: row.role,
  fullName: row.full_name,
  isActive: row.is_active,
  createdAt: row.created_at.toISOString(),
})

const SEARCH_SQL = 'SELECT * FROM users ORDER BY role, created_at'
const FIND_BY_LOGIN_SQL = 'SELECT * FROM users WHERE login = $1'
const FIND_SQL = 'SELECT * FROM users WHERE id = $1'
const COUNT_ROLE_SQL = 'SELECT count(*)::text AS total FROM users WHERE role = $1 AND is_active = true'
const CREATE_SQL = 'INSERT INTO users (login, password_hash, role, full_name) VALUES ($1, $2, $3, $4) RETURNING *'
const UPDATE_SQL = 'UPDATE users SET full_name = $2, is_active = $3 WHERE id = $1 RETURNING *'
const PASSWORD_SQL = 'UPDATE users SET password_hash = $2 WHERE id = $1'
const DELETE_SQL = 'DELETE FROM users WHERE id = $1 RETURNING id'

const LIST_SQL = 'SELECT * FROM users WHERE is_active = true ORDER BY role, full_name'

export const usersDb = {
  list: async (): Promise<IUser[]> => (await pool.query<IUserRow>(LIST_SQL)).rows.map(toUser),
  searchPaged: async (params: IUserSearchParams = {}, allowedRoles?: UserRole[]): Promise<IPagedResult<IUser>> => {
    const conditions: string[] = []
    const values: (string | number | string[])[] = []

    if (params.query?.trim()) {
      values.push(`%${params.query.trim()}%`)
      const idx = values.length
      conditions.push(`(full_name ILIKE $${idx} OR login ILIKE $${idx})`)
    }

    if (allowedRoles && allowedRoles.length > 0) {
      values.push(allowedRoles)
      conditions.push(`role = ANY($${values.length})`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const countSql = `SELECT count(*)::text AS total FROM users ${whereClause}`
    const countResult = await pool.query<{ total: string }>(countSql, values)
    const total = Number(countResult.rows[0]?.total ?? 0)

    const page = Math.max(Number(params.page) || 1, 1)
    const limit = Math.max(Number(params.limit) || 10, 1)
    const offset = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    const listSql = `SELECT * FROM users ${whereClause} ORDER BY role, created_at LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    const result = await pool.query<IUserRow>(listSql, [...values, limit, offset])

    return {
      items: result.rows.map(toUser),
      total,
      page,
      limit,
      totalPages,
    }
  },
  findRowByLogin: async (login: string): Promise<IUserRow | null> =>
    (await pool.query<IUserRow>(FIND_BY_LOGIN_SQL, [login])).rows[0] ?? null,
  findRow: async (id: string): Promise<IUserRow | null> => (await pool.query<IUserRow>(FIND_SQL, [id])).rows[0] ?? null,
  find: async (id: string): Promise<IUser | null> => {
    const row = (await pool.query<IUserRow>(FIND_SQL, [id])).rows[0]
    return row ? toUser(row) : null
  },
  countActiveByRole: async (role: UserRole): Promise<number> =>
    Number((await pool.query<{ total: string }>(COUNT_ROLE_SQL, [role])).rows[0]?.total ?? 0),
  create: async (login: string, passwordHash: string, role: UserRole, fullName: string): Promise<IUser> =>
    toUser((await pool.query<IUserRow>(CREATE_SQL, [login, passwordHash, role, fullName])).rows[0]!),
  update: async (id: string, fullName: string, isActive: boolean): Promise<IUser | null> => {
    const row = (await pool.query<IUserRow>(UPDATE_SQL, [id, fullName, isActive])).rows[0]
    return row ? toUser(row) : null
  },
  setPassword: async (id: string, passwordHash: string): Promise<void> => {
    await pool.query(PASSWORD_SQL, [id, passwordHash])
  },
  remove: async (id: string): Promise<boolean> => ((await pool.query(DELETE_SQL, [id])).rowCount ?? 0) > 0,
}
