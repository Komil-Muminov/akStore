import { pool } from './pool'
import type { ICategory, ICategoryRow } from '../types'

const toCategory = (row: ICategoryRow): ICategory => ({
  id: row.id,
  name: row.name,
  productCount: Number(row.product_count),
})

const LIST_SQL = `
  SELECT c.id, c.name,
         (SELECT count(*)::text FROM products p WHERE p.category_id = c.id AND p.is_active = true) AS product_count
  FROM product_categories c
  ORDER BY c.name`

const CREATE_SQL = 'INSERT INTO product_categories (name) VALUES ($1) RETURNING id'
const RENAME_SQL = 'UPDATE product_categories SET name = $2 WHERE id = $1 RETURNING id'
const DELETE_SQL = 'DELETE FROM product_categories WHERE id = $1 RETURNING id'
const FIND_BY_NAME_SQL = 'SELECT id FROM product_categories WHERE lower(name) = lower($1)'

export const categoriesDb = {
  list: async () => (await pool.query<ICategoryRow>(LIST_SQL)).rows.map(toCategory),
  findByName: async (name: string) =>
    (await pool.query<{ id: string }>(FIND_BY_NAME_SQL, [name])).rows[0]?.id ?? null,
  create: async (name: string) => (await pool.query<{ id: string }>(CREATE_SQL, [name])).rows[0]?.id ?? '',
  rename: async (id: string, name: string) => ((await pool.query(RENAME_SQL, [id, name])).rowCount ?? 0) > 0,
  remove: async (id: string) => ((await pool.query(DELETE_SQL, [id])).rowCount ?? 0) > 0,
}
