import { pool } from './pool'
import type { ICashMove, ICashMoveRow, CashMoveKind } from '../types'

const toMove = (row: ICashMoveRow): ICashMove => ({
  id: row.id,
  kind: row.kind,
  amount: Number(row.amount),
  note: row.note,
  authorName: row.author_name ?? '',
  createdAt: row.created_at.toISOString(),
})

const LIST_SQL = `
  SELECT c.id, c.kind, c.amount, c.note, u.full_name AS author_name, c.created_at
  FROM cash_moves c
  LEFT JOIN users u ON u.id = c.cashier_id
  WHERE c.shift_id = $1
  ORDER BY c.created_at DESC LIMIT $2`

const CREATE_SQL = `
  INSERT INTO cash_moves (shift_id, cashier_id, kind, amount, note)
  VALUES ($1, $2, $3, $4, $5) RETURNING id`

const BALANCE_SQL = `
  SELECT
    coalesce(sum(amount) FILTER (WHERE kind = 'in'), 0)::text AS income,
    coalesce(sum(amount) FILTER (WHERE kind = 'out'), 0)::text AS outcome
  FROM cash_moves WHERE shift_id = $1`

export const cashDb = {
  list: async (shiftId: string, limit: number) =>
    (await pool.query<ICashMoveRow>(LIST_SQL, [shiftId, limit])).rows.map(toMove),
  create: async (shiftId: string, cashierId: string, kind: CashMoveKind, amount: number, note: string) =>
    (await pool.query<{ id: string }>(CREATE_SQL, [shiftId, cashierId, kind, amount, note])).rows[0]?.id ?? '',
  balance: async (shiftId: string) => {
    const row = (await pool.query<{ income: string; outcome: string }>(BALANCE_SQL, [shiftId])).rows[0]
    return Number(row?.income ?? 0) - Number(row?.outcome ?? 0)
  },
}
