import { pool } from './pool'
import { filterOf } from './reports.filters'
import type { IPageParams, IReportParams, ITopProduct, ITopProductRow, TAbcGroup } from '../types'

const ROUND = 100

const round = (value: number) => Math.round(value * ROUND) / ROUND

const FROM_SQL = `
  FROM sale_items i
  JOIN sales s ON s.id = i.sale_id
  JOIN users u ON u.id = s.cashier_id`

const listSql = (where: string, limitIndex: number) => `
  WITH grouped AS (
    SELECT i.product_id, i.name,
      sum(i.quantity) AS quantity,
      sum(i.price * i.quantity) AS revenue,
      sum((i.price - i.cost_price) * i.quantity) AS profit
    ${FROM_SQL} ${where}
    GROUP BY i.product_id, i.name
  ),
  with_totals AS (
    SELECT *,
      coalesce(sum(revenue) OVER (), 0) AS total_revenue,
      coalesce(sum(revenue) OVER (ORDER BY revenue DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 0) AS cum_revenue
    FROM grouped
  )
  SELECT product_id, name,
    quantity::text,
    revenue::text,
    profit::text,
    CASE WHEN total_revenue > 0 THEN round((revenue / total_revenue) * 100, 1)::text ELSE '0' END AS share_percent,
    CASE
      WHEN total_revenue = 0 THEN 'C'
      WHEN (cum_revenue - revenue) / total_revenue < 0.8 THEN 'A'
      WHEN (cum_revenue - revenue) / total_revenue < 0.95 THEN 'B'
      ELSE 'C'
    END AS abc_group
  FROM with_totals
  ORDER BY revenue DESC
  LIMIT $${limitIndex} OFFSET $${limitIndex + 1}`

const countSql = (where: string) => `
  SELECT count(DISTINCT i.product_id)::text AS total ${FROM_SQL} ${where}`

const toProduct = (row: ITopProductRow): ITopProduct => ({
  productId: row.product_id,
  name: row.name,
  quantity: round(Number(row.quantity)),
  revenue: round(Number(row.revenue)),
  profit: round(Number(row.profit)),
  sharePercent: round(Number(row.share_percent ?? 0)),
  abcGroup: (row.abc_group as TAbcGroup) || 'C',
})

export const topProductsDb = {
  search: async (params: IReportParams, page: IPageParams) => {
    const { where, values } = filterOf(params, ['s.refunded_at IS NULL'])
    const total = Number((await pool.query<{ total: string }>(countSql(where), values)).rows[0]?.total ?? 0)
    const rows = (
      await pool.query<ITopProductRow>(listSql(where, values.length + 1), [
        ...values,
        page.limit,
        (page.page - 1) * page.limit,
      ])
    ).rows
    return {
      items: rows.map(toProduct),
      total,
      page: page.page,
      limit: page.limit,
      totalPages: Math.ceil(total / page.limit),
    }
  },
}
