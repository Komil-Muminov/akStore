import { pool } from './pool'
import { filterOf } from './reports.filters'
import type {
  IFiscalReceipt,
  IPageParams,
  IReportParams,
  IFiscalStamp,
  ISale,
  ISaleItem,
  ISaleItemRecord,
  ISaleItemRow,
  ISaleRecord,
  ISaleRow,
} from '../types'

const toItem = (row: ISaleItemRow): ISaleItem => ({
  id: row.id,
  productId: row.product_id,
  name: row.name,
  quantity: Number(row.quantity),
  price: Number(row.price),
  total: Number(row.quantity) * Number(row.price),
  vatRate: Number(row.vat_rate),
  vatAmount: Number(row.vat_amount),
  markCode: row.mark_code,
})

const toFiscal = (row: ISaleRow): IFiscalReceipt | null =>
  row.fiscal_at === null
    ? null
    : {
        number: row.fiscal_number,
        sign: row.fiscal_sign,
        device: row.fiscal_device,
        qr: row.fiscal_qr,
        registeredAt: row.fiscal_at.toISOString(),
      }

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
  vatTotal: Number(row.vat_total),
  refundedAt: row.refunded_at ? row.refunded_at.toISOString() : null,
  createdAt: row.created_at.toISOString(),
  fiscal: toFiscal(row),
  items,
})

const BASE_SQL = `
  SELECT s.id, s.number, s.shift_id, u.full_name AS cashier_name, s.payment,
         s.total, s.discount, s.paid, s.vat_total, s.refunded_at, s.created_at,
         s.fiscal_number, s.fiscal_sign, s.fiscal_device, s.fiscal_qr, s.fiscal_at
  FROM sales s
  JOIN users u ON u.id = s.cashier_id`

const FIND_SQL = `${BASE_SQL} WHERE s.id = $1`

const searchSql = (where: string, limitIndex: number) =>
  `${BASE_SQL} ${where} ORDER BY s.created_at DESC LIMIT $${limitIndex} OFFSET $${limitIndex + 1}`

const countSql = (where: string) =>
  `SELECT count(*)::text AS total FROM sales s JOIN users u ON u.id = s.cashier_id ${where}`

const ITEMS_SQL = `
  SELECT id, sale_id, product_id, name, quantity, price, vat_rate, vat_amount, mark_code
  FROM sale_items WHERE sale_id = ANY($1)`

const CREATE_SALE_SQL = `
  INSERT INTO sales (shift_id, cashier_id, payment, total, discount, paid, vat_total)
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`

const CREATE_ITEM_SQL = `
  INSERT INTO sale_items (sale_id, product_id, name, quantity, price, cost_price, vat_rate, vat_amount, mark_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

const FISCAL_SQL = `
  UPDATE sales SET fiscal_number = $2, fiscal_sign = $3, fiscal_device = $4, fiscal_qr = $5, fiscal_at = now()
  WHERE id = $1 RETURNING id`

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
  create: async (record: ISaleRecord) =>
    (
      await pool.query<{ id: string }>(CREATE_SALE_SQL, [
        record.shiftId,
        record.cashierId,
        record.payment,
        record.total,
        record.discount,
        record.paid,
        record.vatTotal,
      ])
    ).rows[0]?.id ?? '',
  addItem: async (saleId: string, item: ISaleItemRecord) => {
    await pool.query(CREATE_ITEM_SQL, [
      saleId,
      item.productId,
      item.name,
      item.quantity,
      item.price,
      item.costPrice,
      item.vatRate,
      item.vatAmount,
      item.markCode,
    ])
  },
  find: async (id: string) => {
    const row = (await pool.query<ISaleRow>(FIND_SQL, [id])).rows[0]
    if (!row) return null
    const grouped = await itemsOf([row.id])
    return toSale(row, grouped.get(row.id) ?? [])
  },
  search: async (params: IReportParams, page: IPageParams) => {
    const { where, values } = filterOf(params)
    const total = Number((await pool.query<{ total: string }>(countSql(where), values)).rows[0]?.total ?? 0)
    const rows = (
      await pool.query<ISaleRow>(searchSql(where, values.length + 1), [
        ...values,
        page.limit,
        (page.page - 1) * page.limit,
      ])
    ).rows
    const grouped = await itemsOf(rows.map((row) => row.id))
    return {
      items: rows.map((row) => toSale(row, grouped.get(row.id) ?? [])),
      total,
      page: page.page,
      limit: page.limit,
      totalPages: Math.ceil(total / page.limit),
    }
  },
  attachFiscal: async (id: string, stamp: IFiscalStamp) => {
    await pool.query(FISCAL_SQL, [id, stamp.number, stamp.sign, stamp.device, stamp.qr])
  },
  refund: async (id: string) => ((await pool.query(REFUND_SQL, [id])).rowCount ?? 0) > 0,
}
