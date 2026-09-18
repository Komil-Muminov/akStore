import { pool } from './pool'
import type { IDebtMove, IDebtMoveRow, IDebtor, IDebtorInput, IDebtorRow } from '../types'

const toDebtor = (row: IDebtorRow): IDebtor => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  note: row.note,
  balance: Number(row.balance),
  lastMoveAt: row.last_move_at ? row.last_move_at.toISOString() : null,
})

const toMove = (row: IDebtMoveRow): IDebtMove => ({
  id: row.id,
  debtorId: row.debtor_id,
  saleId: row.sale_id,
  amount: Number(row.amount),
  note: row.note,
  authorName: row.author_name ?? '',
  createdAt: row.created_at.toISOString(),
})

const BASE_SQL = `
  SELECT d.id, d.name, d.phone, d.note,
    coalesce((SELECT sum(m.amount) FROM debt_moves m WHERE m.debtor_id = d.id), 0)::text AS balance,
    (SELECT max(m.created_at) FROM debt_moves m WHERE m.debtor_id = d.id) AS last_move_at
  FROM debtors d
  WHERE d.is_active`

const LIST_SQL = `${BASE_SQL} AND ($1::text IS NULL OR d.name ILIKE $1) ORDER BY d.name LIMIT $2`
const FIND_SQL = `${BASE_SQL} AND d.id = $1`
const BY_NAME_SQL = 'SELECT id FROM debtors WHERE lower(name) = lower($1) AND is_active'
const CREATE_SQL = 'INSERT INTO debtors (name, phone, note) VALUES ($1, $2, $3) RETURNING id'
const UPDATE_SQL = 'UPDATE debtors SET name = $2, phone = $3, note = $4 WHERE id = $1 RETURNING id'
const ARCHIVE_SQL = 'UPDATE debtors SET is_active = false WHERE id = $1 RETURNING id'

const MOVES_SQL = `
  SELECT m.id, m.debtor_id, m.sale_id, m.amount, m.note, u.full_name AS author_name, m.created_at
  FROM debt_moves m
  LEFT JOIN users u ON u.id = m.author_id
  WHERE m.debtor_id = $1
  ORDER BY m.created_at DESC LIMIT $2`

const MOVE_SQL = `
  INSERT INTO debt_moves (debtor_id, sale_id, author_id, amount, note)
  VALUES ($1, $2, $3, $4, $5) RETURNING id`

export const debtsDb = {
  list: async (query: string, limit: number) =>
    (await pool.query<IDebtorRow>(LIST_SQL, [query.trim().length > 0 ? `%${query.trim()}%` : null, limit])).rows.map(
      toDebtor,
    ),
  find: async (id: string) => {
    const row = (await pool.query<IDebtorRow>(FIND_SQL, [id])).rows[0]
    return row ? toDebtor(row) : null
  },
  findByName: async (name: string) => (await pool.query<{ id: string }>(BY_NAME_SQL, [name])).rows[0]?.id ?? null,
  create: async (input: IDebtorInput) =>
    (await pool.query<{ id: string }>(CREATE_SQL, [input.name, input.phone, input.note])).rows[0]?.id ?? '',
  update: async (id: string, input: IDebtorInput) =>
    ((await pool.query(UPDATE_SQL, [id, input.name, input.phone, input.note])).rowCount ?? 0) > 0,
  archive: async (id: string) => ((await pool.query(ARCHIVE_SQL, [id])).rowCount ?? 0) > 0,
  moves: async (debtorId: string, limit: number) =>
    (await pool.query<IDebtMoveRow>(MOVES_SQL, [debtorId, limit])).rows.map(toMove),
  addMove: async (debtorId: string, saleId: string | null, authorId: string, amount: number, note: string) =>
    (await pool.query<{ id: string }>(MOVE_SQL, [debtorId, saleId, authorId, amount, note])).rows[0]?.id ?? '',
}
