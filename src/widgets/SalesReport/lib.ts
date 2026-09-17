import { periodStartOf, type IReportFilters } from '@/entities/report'

export const queryOf = (filters: IReportFilters, page?: number, limit?: number) => {
  const params = new URLSearchParams()
  const from = periodStartOf(filters.period)
  if (from.length > 0) params.set('from', from)
  if (filters.cashierId) params.set('cashier', filters.cashierId)
  if (filters.payment) params.set('payment', filters.payment)
  if (filters.query.trim().length > 0) params.set('q', filters.query.trim())
  if (page !== undefined) params.set('page', String(page))
  if (limit !== undefined) params.set('limit', String(limit))
  return params.toString()
}
