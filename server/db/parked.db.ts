import { pool } from './pool'
import type { IParkedLine, IParkedSale, IParkedSaleRow } from '../types'

const toParked = (row: IParkedSaleRow): IParkedSale => ({
  id: row.id,
  cashierName: row.cashier_name,
  note: row.note,
  total: Number(row.total),
  lines: row.lines,
  createdAt: row.created_at.toISOString(),
})

const BASE_SQL = `
  SELECT p.id, u.full_name AS cashier_name, p.note, p.total, p.lines, p.created_at
  FROM parked_sales p
  JOIN users u ON u.id = p.cashier_id`

const LIST_SQL = `${BASE_SQL} WHERE p.cashier_id = $1 ORDER BY p.created_at DESC LIMIT $2`
const FIND_SQL = `${BASE_SQL} WHERE p.id = $1 AND p.cashier_id = $2`
const CREATE_SQL = 'INSERT INTO parked_sales (cashier_id, note, total, lines) VALUES ($1, $2, $3, $4) RETURNING id'
const REMOVE_SQL = 'DELETE FROM parked_sales WHERE id = $1 AND cashier_id = $2 RETURNING id'

export const parkedDb = {
  list: async (cashierId: string, limit: number) =>
    (await pool.query<IParkedSaleRow>(LIST_SQL, [cashierId, limit])).rows.map(toParked),
  find: async (id: string, cashierId: string) => {
    const row = (await pool.query<IParkedSaleRow>(FIND_SQL, [id, cashierId])).rows[0]
    return row ? toParked(row) : null
  },
  create: async (cashierId: string, note: string, total: number, lines: IParkedLine[]) =>
    (await pool.query<{ id: string }>(CREATE_SQL, [cashierId, note, total, JSON.stringify(lines)])).rows[0]?.id ?? '',
  remove: async (id: string, cashierId: string) =>
    ((await pool.query(REMOVE_SQL, [id, cashierId])).rowCount ?? 0) > 0,
}
