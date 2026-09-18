import { pool } from './pool'
import type { IInvoice, IInvoiceItem, IInvoiceItemRow, IInvoiceRow } from '../types'

const toItem = (row: IInvoiceItemRow): IInvoiceItem => ({
  id: row.id,
  productId: row.product_id,
  name: row.name,
  quantity: Number(row.quantity),
  costPrice: Number(row.cost_price),
  total: Math.round(Number(row.quantity) * Number(row.cost_price) * 100) / 100,
})

const toInvoice = (row: IInvoiceRow, items: IInvoiceItem[]): IInvoice => ({
  id: row.id,
  number: row.number,
  supplierId: row.supplier_id,
  supplierName: row.supplier_name,
  outletName: row.outlet_name ?? '',
  authorName: row.author_name ?? '',
  total: Number(row.total),
  paid: Number(row.paid),
  note: row.note,
  createdAt: row.created_at.toISOString(),
  items,
})

const BASE_SQL = `
  SELECT i.id, i.number, i.supplier_id, s.name AS supplier_name, o.name AS outlet_name,
         u.full_name AS author_name, i.total, i.paid, i.note, i.created_at
  FROM invoices i
  JOIN suppliers s ON s.id = i.supplier_id
  LEFT JOIN outlets o ON o.id = i.outlet_id
  LEFT JOIN users u ON u.id = i.author_id`

const LIST_SQL = `${BASE_SQL} WHERE ($1::uuid IS NULL OR i.supplier_id = $1) ORDER BY i.created_at DESC LIMIT $2`
const FIND_SQL = `${BASE_SQL} WHERE i.id = $1`
const ITEMS_SQL = `
  SELECT id, invoice_id, product_id, name, quantity, cost_price
  FROM invoice_items WHERE invoice_id = ANY($1)`

const CREATE_SQL = `
  INSERT INTO invoices (supplier_id, outlet_id, author_id, total, paid, note)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

const ITEM_SQL = `
  INSERT INTO invoice_items (invoice_id, product_id, name, quantity, cost_price)
  VALUES ($1, $2, $3, $4, $5)`

const PAY_SQL = 'UPDATE invoices SET paid = paid + $2 WHERE id = $1 RETURNING id'

const itemsOf = async (ids: string[]) => {
  if (ids.length === 0) return new Map<string, IInvoiceItem[]>()
  const rows = (await pool.query<IInvoiceItemRow>(ITEMS_SQL, [ids])).rows
  const grouped = new Map<string, IInvoiceItem[]>()
  for (const row of rows) {
    const list = grouped.get(row.invoice_id) ?? []
    list.push(toItem(row))
    grouped.set(row.invoice_id, list)
  }
  return grouped
}

export const invoicesDb = {
  list: async (supplierId: string | null, limit: number) => {
    const rows = (await pool.query<IInvoiceRow>(LIST_SQL, [supplierId, limit])).rows
    const grouped = await itemsOf(rows.map((row) => row.id))
    return rows.map((row) => toInvoice(row, grouped.get(row.id) ?? []))
  },
  find: async (id: string) => {
    const row = (await pool.query<IInvoiceRow>(FIND_SQL, [id])).rows[0]
    if (!row) return null
    const grouped = await itemsOf([row.id])
    return toInvoice(row, grouped.get(row.id) ?? [])
  },
  create: async (
    supplierId: string,
    outletId: string | null,
    authorId: string,
    total: number,
    paid: number,
    note: string,
  ) => (await pool.query<{ id: string }>(CREATE_SQL, [supplierId, outletId, authorId, total, paid, note])).rows[0]?.id ?? '',
  addItem: async (invoiceId: string, productId: string, name: string, quantity: number, costPrice: number) => {
    await pool.query(ITEM_SQL, [invoiceId, productId, name, quantity, costPrice])
  },
  pay: async (id: string, amount: number) => ((await pool.query(PAY_SQL, [id, amount])).rowCount ?? 0) > 0,
}
