import { pool } from './pool'
import type { IShift, IShiftRow, IShiftTotals, IShiftTotalsRow } from '../types'

const toShift = (row: IShiftRow): IShift => ({
  id: row.id,
  number: row.number,
  cashierId: row.cashier_id,
  cashierName: row.cashier_name,
  openedAt: row.opened_at.toISOString(),
  closedAt: row.closed_at ? row.closed_at.toISOString() : null,
  openingCash: Number(row.opening_cash),
  closingCash: row.closing_cash === null ? null : Number(row.closing_cash),
  note: row.note,
  outletId: row.outlet_id,
  outletName: row.outlet_name ?? '',
})

const BASE_SQL = `
  SELECT s.id, s.number, s.cashier_id, u.full_name AS cashier_name, s.opened_at, s.closed_at,
         s.opening_cash, s.closing_cash, s.note, s.outlet_id, o.name AS outlet_name
  FROM shifts s
  JOIN users u ON u.id = s.cashier_id
  LEFT JOIN outlets o ON o.id = s.outlet_id`

const CURRENT_SQL = `${BASE_SQL} WHERE s.cashier_id = $1 AND s.closed_at IS NULL LIMIT 1`
const FIND_SQL = `${BASE_SQL} WHERE s.id = $1`
const LIST_SQL = `${BASE_SQL} ORDER BY s.opened_at DESC LIMIT $1`

const OPEN_SQL = 'INSERT INTO shifts (cashier_id, opening_cash, outlet_id) VALUES ($1, $2, $3) RETURNING id'
const CLOSE_SQL = `
  UPDATE shifts SET closed_at = now(), closing_cash = $2, note = $3
  WHERE id = $1 AND closed_at IS NULL RETURNING id`

const TOTALS_SQL = `
  SELECT
    count(*) FILTER (WHERE refunded_at IS NULL)::text AS sales_count,
    coalesce(sum(least(cash_amount, total)) FILTER (WHERE refunded_at IS NULL), 0)::text AS cash_total,
    coalesce(sum(card_amount) FILTER (WHERE refunded_at IS NULL), 0)::text AS card_total,
    coalesce(sum(total) FILTER (WHERE refunded_at IS NOT NULL), 0)::text AS refund_total
  FROM sales WHERE shift_id = $1`

export const shiftsDb = {
  current: async (cashierId: string) => {
    const row = (await pool.query<IShiftRow>(CURRENT_SQL, [cashierId])).rows[0]
    return row ? toShift(row) : null
  },
  find: async (id: string) => {
    const row = (await pool.query<IShiftRow>(FIND_SQL, [id])).rows[0]
    return row ? toShift(row) : null
  },
  list: async (limit: number) => (await pool.query<IShiftRow>(LIST_SQL, [limit])).rows.map(toShift),
  open: async (cashierId: string, openingCash: number, outletId: string | null) =>
    (await pool.query<{ id: string }>(OPEN_SQL, [cashierId, openingCash, outletId])).rows[0]?.id ?? '',
  close: async (id: string, closingCash: number, note: string) =>
    ((await pool.query(CLOSE_SQL, [id, closingCash, note])).rowCount ?? 0) > 0,
  totals: async (shiftId: string, openingCash: number) => {
    const row = (await pool.query<IShiftTotalsRow>(TOTALS_SQL, [shiftId])).rows[0]
    const cashTotal = Number(row?.cash_total ?? 0)
    const cardTotal = Number(row?.card_total ?? 0)
    const refundTotal = Number(row?.refund_total ?? 0)
    const totals: IShiftTotals = {
      salesCount: Number(row?.sales_count ?? 0),
      cashTotal,
      cardTotal,
      refundTotal,
      revenue: cashTotal + cardTotal,
      expectedCash: openingCash + cashTotal,
    }
    return totals
  },
}
