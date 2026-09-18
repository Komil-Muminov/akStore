import { pool } from './pool'
import type { IUser, IUserRow, IUserSearchParams, UserRole } from '../types'

const toUser = (row: IUserRow): IUser => ({
  id: row.id,
  login: row.login,
  role: row.role,
  fullName: row.full_name,
  outletId: row.outlet_id,
  outletName: row.outlet_name ?? '',
  isActive: row.is_active,
  createdAt: row.created_at.toISOString(),
})

const BASE_SQL = `
  SELECT u.*, o.name AS outlet_name
  FROM users u
  LEFT JOIN outlets o ON o.id = u.outlet_id`

const FIND_BY_LOGIN_SQL = `${BASE_SQL} WHERE u.login = $1`
const FIND_SQL = `${BASE_SQL} WHERE u.id = $1`
const COUNT_ROLE_SQL = 'SELECT count(*)::text AS total FROM users WHERE role = $1 AND is_active = true'
const CREATE_SQL = `
  INSERT INTO users (login, password_hash, role, full_name, outlet_id)
  VALUES ($1, $2, $3, $4, $5) RETURNING id`
const UPDATE_SQL = 'UPDATE users SET full_name = $2, is_active = $3, outlet_id = $4 WHERE id = $1 RETURNING id'
const PASSWORD_SQL = 'UPDATE users SET password_hash = $2 WHERE id = $1'
const DELETE_SQL = 'DELETE FROM users WHERE id = $1 RETURNING id'

const LIST_SQL = `${BASE_SQL} WHERE u.is_active = true ORDER BY u.role, u.full_name`

const OUTLET_SQL = 'SELECT outlet_id FROM users WHERE id = $1'
const SET_OUTLET_SQL = 'UPDATE users SET outlet_id = $2 WHERE id = $1 RETURNING id'

export const usersDb = {
  outletOf: async (id: string) =>
    (await pool.query<{ outlet_id: string | null }>(OUTLET_SQL, [id])).rows[0]?.outlet_id ?? null,
  setOutlet: async (id: string, outletId: string | null) =>
    ((await pool.query(SET_OUTLET_SQL, [id, outletId])).rowCount ?? 0) > 0,
  list: async () => (await pool.query<IUserRow>(LIST_SQL)).rows.map(toUser),
  searchPaged: async (params: IUserSearchParams = {}, allowedRoles?: UserRole[]) => {
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

    const listSql = `${BASE_SQL} ${whereClause.replace(/full_name/g, 'u.full_name').replace(/login/g, 'u.login').replace(/role/g, 'u.role')} ORDER BY u.role, u.created_at LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    const result = await pool.query<IUserRow>(listSql, [...values, limit, offset])

    return {
      items: result.rows.map(toUser),
      total,
      page,
      limit,
      totalPages,
    }
  },
  findRowByLogin: async (login: string) =>
    (await pool.query<IUserRow>(FIND_BY_LOGIN_SQL, [login])).rows[0] ?? null,
  findRow: async (id: string) => (await pool.query<IUserRow>(FIND_SQL, [id])).rows[0] ?? null,
  find: async (id: string) => {
    const row = (await pool.query<IUserRow>(FIND_SQL, [id])).rows[0]
    return row ? toUser(row) : null
  },
  countActiveByRole: async (role: UserRole) =>
    Number((await pool.query<{ total: string }>(COUNT_ROLE_SQL, [role])).rows[0]?.total ?? 0),
  create: async (
    login: string,
    passwordHash: string,
    role: UserRole,
    fullName: string,
    outletId: string | null = null,
  ) => {
    const created = (
      await pool.query<{ id: string }>(CREATE_SQL, [login, passwordHash, role, fullName, outletId])
    ).rows[0]
    const row = created ? (await pool.query<IUserRow>(FIND_SQL, [created.id])).rows[0] : undefined
    return toUser(row!)
  },
  update: async (id: string, fullName: string, isActive: boolean, outletId: string | null = null) => {
    await pool.query(UPDATE_SQL, [id, fullName, isActive, outletId])
    const row = (await pool.query<IUserRow>(FIND_SQL, [id])).rows[0]
    return row ? toUser(row) : null
  },
  setPassword: async (id: string, passwordHash: string) => {
    await pool.query(PASSWORD_SQL, [id, passwordHash])
  },
  remove: async (id: string) => ((await pool.query(DELETE_SQL, [id])).rowCount ?? 0) > 0,
}
