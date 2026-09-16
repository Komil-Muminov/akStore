import { pool } from './pool'
import type { IPosition, IPositionInput, IPositionRow } from '../types'

const toPosition = (row: IPositionRow): IPosition => ({ id: row.id, name: row.name, rank: row.rank })

const SEARCH_SQL = 'SELECT * FROM positions ORDER BY rank, name'
const CREATE_SQL = 'INSERT INTO positions (name, rank) VALUES ($1, $2) RETURNING *'
const UPDATE_SQL = 'UPDATE positions SET name = $2, rank = $3 WHERE id = $1 RETURNING *'
const DELETE_SQL = 'DELETE FROM positions WHERE id = $1 RETURNING id'
const USAGE_SQL = 'SELECT count(*)::text AS total FROM unit_positions WHERE position_id = $1'

export const positionsDb = {
  search: async (): Promise<IPosition[]> => {
    const result = await pool.query<IPositionRow>(SEARCH_SQL)
    return result.rows.map(toPosition)
  },
  create: async (input: IPositionInput): Promise<IPosition> => {
    const result = await pool.query<IPositionRow>(CREATE_SQL, [input.name, input.rank])
    return toPosition(result.rows[0]!)
  },
  update: async (id: string, input: IPositionInput): Promise<IPosition | null> => {
    const result = await pool.query<IPositionRow>(UPDATE_SQL, [id, input.name, input.rank])
    return result.rows[0] ? toPosition(result.rows[0]) : null
  },
  usageCount: async (id: string): Promise<number> => {
    const result = await pool.query<{ total: string }>(USAGE_SQL, [id])
    return Number(result.rows[0]?.total ?? 0)
  },
  remove: async (id: string): Promise<boolean> => {
    const result = await pool.query(DELETE_SQL, [id])
    return (result.rowCount ?? 0) > 0
  },
}
