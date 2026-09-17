import { pool } from './pool'
import type { ISale, ISaleItem, ISaleItemRow, ISaleRow, ISalesParams, PaymentKind } from '../types'

const toItem = (row: ISaleItemRow): ISaleItem => ({
  id: row.id,
  productId: row.product_id,
  name: row.name,
  quantity: Number(row.quantity),
  price: Number(row.price),
  total: Number(row.quantity) * Number(row.price),
})

const toSale = (row: ISaleRow, items: ISaleItem[]): ISale => ({
  id: row.id,
  number: row.number,
  shiftId: row.shift_id,
  cashierName: row.cashier_name,
  payment: row.payment,
  total: Number(row.total),
  discount: Number(row.discount),
  paid: Number(row.paid),
  change: Math.max(0, Number(row.paid) - Number(row.total)),
  refundedAt: row.refunded_at ? row.refunded_at.toISOString() : null,
  createdAt: row.created_at.toISOString(),
  items,
})

const BASE_SQL = `
  SELECT s.id, s.number, s.shift_id, u.full_name AS cashier_name, s.payment,
         s.total, s.discount, s.paid, s.refunded_at, s.created_at
  FROM sales s
  JOIN users u ON u.id = s.cashier_id`

const FIND_SQL = `${BASE_SQL} WHERE s.id = $1`

const SEARCH_SQL = `${BASE_SQL}
  WHERE ($1::uuid IS NULL OR s.shift_id = $1)
    AND ($2::timestamptz IS NULL OR s.created_at >= $2)
    AND ($3::timestamptz IS NULL OR s.created_at <= $3)
  ORDER BY s.created_at DESC LIMIT $4`

const ITEMS_SQL = 'SELECT id, sale_id, product_id, name, quantity, price FROM sale_items WHERE sale_id = ANY($1)'

const CREATE_SALE_SQL = `
  INSERT INTO sales (shift_id, cashier_id, payment, total, discount, paid)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

const CREATE_ITEM_SQL = `
  INSERT INTO sale_items (sale_id, product_id, name, quantity, price, cost_price)
  VALUES ($1, $2, $3, $4, $5, $6)`

const REFUND_SQL = 'UPDATE sales SET refunded_at = now() WHERE id = $1 AND refunded_at IS NULL RETURNING id'

const itemsOf = async (saleIds: string[]) => {
  if (saleIds.length === 0) return new Map<string, ISaleItem[]>()
  const rows = (await pool.query<ISaleItemRow>(ITEMS_SQL, [saleIds])).rows
  const grouped = new Map<string, ISaleItem[]>()
  for (const row of rows) {
    const list = grouped.get(row.sale_id) ?? []
    list.push(toItem(row))
    grouped.set(row.sale_id, list)
  }
  return grouped
}

export const salesDb = {
  create: async (
    shiftId: string,
    cashierId: string,
    payment: PaymentKind,
    total: number,
    discount: number,
    paid: number,
  ) => (await pool.query<{ id: string }>(CREATE_SALE_SQL, [shiftId, cashierId, payment, total, discount, paid])).rows[0]?.id ?? '',
  addItem: async (saleId: string, productId: string, name: string, quantity: number, price: number, costPrice: number) => {
    await pool.query(CREATE_ITEM_SQL, [saleId, productId, name, quantity, price, costPrice])
  },
  find: async (id: string) => {
    const row = (await pool.query<ISaleRow>(FIND_SQL, [id])).rows[0]
    if (!row) return null
    const grouped = await itemsOf([row.id])
    return toSale(row, grouped.get(row.id) ?? [])
  },
  search: async (params: ISalesParams, limit: number) => {
    const rows = (
      await pool.query<ISaleRow>(SEARCH_SQL, [params.shiftId ?? null, params.from ?? null, params.to ?? null, limit])
    ).rows
    const grouped = await itemsOf(rows.map((row) => row.id))
    return rows.map((row) => toSale(row, grouped.get(row.id) ?? []))
  },
  refund: async (id: string) => ((await pool.query(REFUND_SQL, [id])).rowCount ?? 0) > 0,
}
