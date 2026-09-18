import { pool } from './pool'
import type { IProduct, IProductInput, IProductRow, IProductSearchParams } from '../types'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

const toProduct = (row: IProductRow): IProduct => ({
  id: row.id,
  barcode: row.barcode ?? '',
  name: row.name,
  categoryId: row.category_id,
  categoryName: row.category_name ?? '',
  unit: row.unit,
  costPrice: Number(row.cost_price),
  salePrice: Number(row.sale_price),
  stock: Number(row.stock),
  vatRate: Number(row.vat_rate),
  markCode: row.mark_code,
  isActive: row.is_active,
})

const BASE_SQL = `
  SELECT p.id, p.barcode, p.name, p.category_id, c.name AS category_name,
         p.unit, p.cost_price, p.sale_price, p.stock, p.vat_rate, p.mark_code, p.is_active
  FROM products p
  LEFT JOIN product_categories c ON c.id = p.category_id`

const FIND_SQL = `${BASE_SQL} WHERE p.id = $1`
const BY_BARCODE_SQL = `${BASE_SQL} WHERE p.barcode = $1 AND p.is_active = true`
const BY_NAME_SQL = `${BASE_SQL} WHERE lower(p.name) = lower($1) AND p.is_active = true LIMIT 1`

const CREATE_SQL = `
  INSERT INTO products (barcode, name, category_id, unit, cost_price, sale_price, vat_rate, mark_code)
  VALUES (NULLIF($1, ''), $2, $3, $4, $5, $6, $7, $8) RETURNING id`

const UPDATE_SQL = `
  UPDATE products SET barcode = NULLIF($2, ''), name = $3, category_id = $4,
    unit = $5, cost_price = $6, sale_price = $7, vat_rate = $8, mark_code = $9, updated_at = now()
  WHERE id = $1 RETURNING id`

const ARCHIVE_SQL = 'UPDATE products SET is_active = false, updated_at = now() WHERE id = $1 RETURNING id'

const toValues = (input: IProductInput) => [
  input.barcode,
  input.name,
  input.categoryId,
  input.unit,
  input.costPrice,
  input.salePrice,
  input.vatRate,
  input.markCode,
]

export const productsDb = {
  search: async (params: IProductSearchParams = {}) => {
    const conditions = ['p.is_active = true']
    const values: (string | number)[] = []
    if (params.query?.trim()) {
      values.push(`%${params.query.trim()}%`)
      conditions.push(`(p.name ILIKE $${values.length} OR p.barcode ILIKE $${values.length})`)
    }
    if (params.categoryId) {
      values.push(params.categoryId)
      conditions.push(`p.category_id = $${values.length}`)
    }
    const where = `WHERE ${conditions.join(' AND ')}`
    const total = Number(
      (await pool.query<{ total: string }>(`SELECT count(*)::text AS total FROM products p ${where}`, values))
        .rows[0]?.total ?? 0,
    )
    const page = Math.max(params.page ?? DEFAULT_PAGE, DEFAULT_PAGE)
    const limit = Math.max(params.limit ?? DEFAULT_LIMIT, 1)
    const rows = (
      await pool.query<IProductRow>(
        `${BASE_SQL} ${where} ORDER BY p.name LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
        [...values, limit, (page - 1) * limit],
      )
    ).rows
    return { items: rows.map(toProduct), total, page, limit, totalPages: Math.ceil(total / limit) }
  },
  find: async (id: string) => {
    const row = (await pool.query<IProductRow>(FIND_SQL, [id])).rows[0]
    return row ? toProduct(row) : null
  },
  findByBarcode: async (barcode: string) => {
    const row = (await pool.query<IProductRow>(BY_BARCODE_SQL, [barcode])).rows[0]
    return row ? toProduct(row) : null
  },
  findByName: async (name: string) => {
    const row = (await pool.query<IProductRow>(BY_NAME_SQL, [name])).rows[0]
    return row ? toProduct(row) : null
  },
  create: async (input: IProductInput) =>
    (await pool.query<{ id: string }>(CREATE_SQL, toValues(input))).rows[0]?.id ?? '',
  update: async (id: string, input: IProductInput) =>
    ((await pool.query(UPDATE_SQL, [id, ...toValues(input)])).rowCount ?? 0) > 0,
  archive: async (id: string) => ((await pool.query(ARCHIVE_SQL, [id])).rowCount ?? 0) > 0,
}
