import { pool } from './pool'
import type { ISupplier, ISupplierInput, ISupplierRow } from '../types'

const toSupplier = (row: ISupplierRow): ISupplier => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  note: row.note,
  debt: Number(row.debt),
  invoiceCount: Number(row.invoice_count),
})

const BASE_SQL = `
  SELECT s.id, s.name, s.phone, s.note,
    coalesce((SELECT sum(i.total - i.paid) FROM invoices i WHERE i.supplier_id = s.id), 0)::text AS debt,
    coalesce((SELECT count(*) FROM invoices i WHERE i.supplier_id = s.id), 0)::text AS invoice_count
  FROM suppliers s
  WHERE s.is_active`

const LIST_SQL = `${BASE_SQL} AND ($1::text IS NULL OR s.name ILIKE $1) ORDER BY s.name LIMIT $2`
const FIND_SQL = `${BASE_SQL} AND s.id = $1`
const BY_NAME_SQL = 'SELECT id FROM suppliers WHERE lower(name) = lower($1) AND is_active'
const CREATE_SQL = 'INSERT INTO suppliers (name, phone, note) VALUES ($1, $2, $3) RETURNING id'
const UPDATE_SQL = 'UPDATE suppliers SET name = $2, phone = $3, note = $4 WHERE id = $1 RETURNING id'
const ARCHIVE_SQL = 'UPDATE suppliers SET is_active = false WHERE id = $1 RETURNING id'

export const suppliersDb = {
  list: async (query: string, limit: number) =>
    (await pool.query<ISupplierRow>(LIST_SQL, [query.trim().length > 0 ? `%${query.trim()}%` : null, limit])).rows.map(
      toSupplier,
    ),
  find: async (id: string) => {
    const row = (await pool.query<ISupplierRow>(FIND_SQL, [id])).rows[0]
    return row ? toSupplier(row) : null
  },
  findByName: async (name: string) => (await pool.query<{ id: string }>(BY_NAME_SQL, [name])).rows[0]?.id ?? null,
  create: async (input: ISupplierInput) =>
    (await pool.query<{ id: string }>(CREATE_SQL, [input.name, input.phone, input.note])).rows[0]?.id ?? '',
  update: async (id: string, input: ISupplierInput) =>
    ((await pool.query(UPDATE_SQL, [id, input.name, input.phone, input.note])).rowCount ?? 0) > 0,
  archive: async (id: string) => ((await pool.query(ARCHIVE_SQL, [id])).rowCount ?? 0) > 0,
}
