import { pool } from './pool'
import { PassStatus, type IPass, type IPassRow } from '../types'

const toPass = (row: IPassRow): IPass => ({
  id: row.id,
  holderName: row.holder_name,
  status: row.status,
  createdAt: row.created_at.toISOString(),
})

const SEARCH_SQL = 'SELECT * FROM passes ORDER BY created_at DESC'
const CREATE_SQL = 'INSERT INTO passes (holder_name) VALUES ($1) RETURNING *'
const SET_STATUS_SQL = 'UPDATE passes SET status = $2 WHERE id = $1 RETURNING *'

export const passesDb = {
  search: async (): Promise<IPass[]> => {
    const result = await pool.query<IPassRow>(SEARCH_SQL)
    return result.rows.map(toPass)
  },
  create: async (holderName: string): Promise<IPass> => {
    const result = await pool.query<IPassRow>(CREATE_SQL, [holderName])
    return toPass(result.rows[0]!)
  },
  setStatus: async (id: string, status: PassStatus): Promise<IPass | null> => {
    const result = await pool.query<IPassRow>(SET_STATUS_SQL, [id, status])
    const row = result.rows[0]
    return row ? toPass(row) : null
  },
}
