export enum PeriodKind {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all',
}

export interface IReportFilters {
  period: PeriodKind
  outletId: string | null
  cashierId: string | null
  payment: string | null
  query: string
}

export interface IReportSummary {
  salesCount: number
  revenue: number
  cost: number
  profit: number
  margin: number
  average: number
  vatTotal: number
  refundTotal: number
  refundCount: number
}

export interface ITopProduct {
  productId: string
  name: string
  quantity: number
  revenue: number
  profit: number
}

export interface ICashierStat {
  cashierId: string
  name: string
  salesCount: number
  revenue: number
  profit: number
  refundTotal: number
}

export interface IDailyPoint {
  day: string
  salesCount: number
  revenue: number
  profit: number
}

export const PERIOD_OPTIONS = [
  { id: PeriodKind.TODAY, label: 'Сегодня' },
  { id: PeriodKind.WEEK, label: 'Неделя' },
  { id: PeriodKind.MONTH, label: 'Месяц' },
  { id: PeriodKind.ALL, label: 'Всё время' },
]

export const PAYMENT_OPTIONS = [
  { id: 'cash', label: 'Наличные' },
  { id: 'card', label: 'Карта' },
]

export const EMPTY_FILTERS: IReportFilters = {
  period: PeriodKind.TODAY,
  outletId: null,
  cashierId: null,
  payment: null,
  query: '',
}
