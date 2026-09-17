import type { IReportParams } from '../types'

export interface IFilterSql {
  where: string
  values: (string | number)[]
}

export const filterOf = (params: IReportParams, extra: string[] = []): IFilterSql => {
  const conditions = [...extra]
  const values: (string | number)[] = []
  if (params.from) {
    values.push(params.from)
    conditions.push(`s.created_at >= $${values.length}`)
  }
  if (params.to) {
    values.push(params.to)
    conditions.push(`s.created_at <= $${values.length}`)
  }
  if (params.shiftId) {
    values.push(params.shiftId)
    conditions.push(`s.shift_id = $${values.length}`)
  }
  if (params.cashierId) {
    values.push(params.cashierId)
    conditions.push(`s.cashier_id = $${values.length}`)
  }
  if (params.payment) {
    values.push(params.payment)
    conditions.push(`s.payment = $${values.length}`)
  }
  if (params.query.trim().length > 0) {
    values.push(`%${params.query.trim()}%`)
    conditions.push(`(s.number::text ILIKE $${values.length} OR u.full_name ILIKE $${values.length})`)
  }
  return { where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '', values }
}

export const COST_SQL = `
  (SELECT coalesce(sum(i.cost_price * i.quantity), 0) FROM sale_items i WHERE i.sale_id = s.id)`
