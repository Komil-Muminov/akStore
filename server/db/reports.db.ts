import { pool } from './pool'
import { COST_SQL, filterOf } from './reports.filters'
import type {
  ICashierStat,
  ICashierStatRow,
  IDailyPoint,
  IDailyPointRow,
  IReportParams,
  IReportSummary,
  IReportSummaryRow,
} from '../types'

const ROUND = 100
const PERCENT = 100

const round = (value: number) => Math.round(value * ROUND) / ROUND

const summarySql = (where: string) => `
  WITH filtered AS (
    SELECT s.total, s.vat_total, s.refunded_at, ${COST_SQL} AS cost
    FROM sales s JOIN users u ON u.id = s.cashier_id ${where}
  )
  SELECT
    count(*) FILTER (WHERE refunded_at IS NULL)::text AS sales_count,
    coalesce(sum(total) FILTER (WHERE refunded_at IS NULL), 0)::text AS revenue,
    coalesce(sum(cost) FILTER (WHERE refunded_at IS NULL), 0)::text AS cost,
    coalesce(sum(vat_total) FILTER (WHERE refunded_at IS NULL), 0)::text AS vat_total,
    coalesce(sum(total) FILTER (WHERE refunded_at IS NOT NULL), 0)::text AS refund_total,
    count(*) FILTER (WHERE refunded_at IS NOT NULL)::text AS refund_count
  FROM filtered`

const cashiersSql = (where: string) => `
  SELECT s.cashier_id, u.full_name AS name,
    count(*) FILTER (WHERE s.refunded_at IS NULL)::text AS sales_count,
    coalesce(sum(s.total) FILTER (WHERE s.refunded_at IS NULL), 0)::text AS revenue,
    coalesce(sum(${COST_SQL}) FILTER (WHERE s.refunded_at IS NULL), 0)::text AS cost,
    coalesce(sum(s.total) FILTER (WHERE s.refunded_at IS NOT NULL), 0)::text AS refund_total
  FROM sales s JOIN users u ON u.id = s.cashier_id ${where}
  GROUP BY s.cashier_id, u.full_name
  ORDER BY sum(s.total) FILTER (WHERE s.refunded_at IS NULL) DESC NULLS LAST`

const dailySql = (where: string) => `
  SELECT date_trunc('day', s.created_at) AS day,
    count(*)::text AS sales_count,
    coalesce(sum(s.total), 0)::text AS revenue,
    coalesce(sum(${COST_SQL}), 0)::text AS cost
  FROM sales s JOIN users u ON u.id = s.cashier_id ${where}
  GROUP BY day ORDER BY day`

const toSummary = (row: IReportSummaryRow | undefined): IReportSummary => {
  const salesCount = Number(row?.sales_count ?? 0)
  const revenue = round(Number(row?.revenue ?? 0))
  const cost = round(Number(row?.cost ?? 0))
  const profit = round(revenue - cost)
  return {
    salesCount,
    revenue,
    cost,
    profit,
    margin: revenue > 0 ? round((profit / revenue) * PERCENT) : 0,
    average: salesCount > 0 ? round(revenue / salesCount) : 0,
    vatTotal: round(Number(row?.vat_total ?? 0)),
    refundTotal: round(Number(row?.refund_total ?? 0)),
    refundCount: Number(row?.refund_count ?? 0),
  }
}

const toCashier = (row: ICashierStatRow): ICashierStat => ({
  cashierId: row.cashier_id,
  name: row.name,
  salesCount: Number(row.sales_count),
  revenue: round(Number(row.revenue)),
  profit: round(Number(row.revenue) - Number(row.cost)),
  refundTotal: round(Number(row.refund_total)),
})

const toDaily = (row: IDailyPointRow): IDailyPoint => ({
  day: row.day.toISOString(),
  salesCount: Number(row.sales_count),
  revenue: round(Number(row.revenue)),
  profit: round(Number(row.revenue) - Number(row.cost)),
})

export const reportsDb = {
  summary: async (params: IReportParams) => {
    const { where, values } = filterOf(params)
    return toSummary((await pool.query<IReportSummaryRow>(summarySql(where), values)).rows[0])
  },
  cashiers: async (params: IReportParams) => {
    const { where, values } = filterOf(params)
    return (await pool.query<ICashierStatRow>(cashiersSql(where), values)).rows.map(toCashier)
  },
  daily: async (params: IReportParams) => {
    const { where, values } = filterOf(params, ['s.refunded_at IS NULL'])
    return (await pool.query<IDailyPointRow>(dailySql(where), values)).rows.map(toDaily)
  },
}
