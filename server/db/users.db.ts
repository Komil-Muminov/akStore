import { pool } from './pool'
import type { IUser, IUserRow, UserRole } from '../types'

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

export const usersDb = {
  search: async (): Promise<IUser[]> => (await pool.query<IUserRow>(SEARCH_SQL)).rows.map(toUser),
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
