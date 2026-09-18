import { pool } from './pool'
import type { IOutlet, IOutletInput, IOutletRow } from '../types'

const toOutlet = (row: IOutletRow): IOutlet => ({
  id: row.id,
  name: row.name,
  address: row.address,
  phone: row.phone,
  productCount: Number(row.product_count),
  stockValue: Number(row.stock_value),
})

const BASE_SQL = `
  SELECT o.id, o.name, o.address, o.phone,
    coalesce((SELECT count(*) FROM product_stocks s WHERE s.outlet_id = o.id AND s.quantity > 0), 0)::text
      AS product_count,
    coalesce((
      SELECT sum(s.quantity * p.cost_price) FROM product_stocks s
      JOIN products p ON p.id = s.product_id WHERE s.outlet_id = o.id
    ), 0)::text AS stock_value
  FROM outlets o
  WHERE o.is_active`

const LIST_SQL = `${BASE_SQL} ORDER BY o.name`
const FIND_SQL = `${BASE_SQL} AND o.id = $1`
const BY_NAME_SQL = 'SELECT id FROM outlets WHERE lower(name) = lower($1) AND is_active'
const CREATE_SQL = 'INSERT INTO outlets (name, address, phone) VALUES ($1, $2, $3) RETURNING id'
const UPDATE_SQL = 'UPDATE outlets SET name = $2, address = $3, phone = $4 WHERE id = $1 RETURNING id'
const ARCHIVE_SQL = 'UPDATE outlets SET is_active = false WHERE id = $1 RETURNING id'
const FIRST_SQL = 'SELECT id FROM outlets WHERE is_active ORDER BY created_at LIMIT 1'

export const outletsDb = {
  list: async () => (await pool.query<IOutletRow>(LIST_SQL)).rows.map(toOutlet),
  find: async (id: string) => {
    const row = (await pool.query<IOutletRow>(FIND_SQL, [id])).rows[0]
    return row ? toOutlet(row) : null
  },
  findByName: async (name: string) => (await pool.query<{ id: string }>(BY_NAME_SQL, [name])).rows[0]?.id ?? null,
  first: async () => (await pool.query<{ id: string }>(FIRST_SQL)).rows[0]?.id ?? null,
  create: async (input: IOutletInput) =>
    (await pool.query<{ id: string }>(CREATE_SQL, [input.name, input.address, input.phone])).rows[0]?.id ?? '',
  update: async (id: string, input: IOutletInput) =>
    ((await pool.query(UPDATE_SQL, [id, input.name, input.address, input.phone])).rowCount ?? 0) > 0,
  archive: async (id: string) => ((await pool.query(ARCHIVE_SQL, [id])).rowCount ?? 0) > 0,
}
