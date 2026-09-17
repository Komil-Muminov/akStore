import type { PaymentKind } from './sales'

export interface IReportParams {
  from: string | null
  to: string | null
  shiftId: string | null
  cashierId: string | null
  payment: PaymentKind | null
  query: string
}

export interface IPageParams {
  page: number
  limit: number
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

export interface IReportSummaryRow {
  sales_count: string
  revenue: string
  cost: string
  vat_total: string
  refund_total: string
  refund_count: string
}

export interface ITopProduct {
  productId: string
  name: string
  quantity: number
  revenue: number
  profit: number
}

export interface ITopProductRow {
  product_id: string
  name: string
  quantity: string
  revenue: string
  profit: string
}

export interface ICashierStat {
  cashierId: string
  name: string
  salesCount: number
  revenue: number
  profit: number
  refundTotal: number
}

export interface ICashierStatRow {
  cashier_id: string
  name: string
  sales_count: string
  revenue: string
  cost: string
  refund_total: string
}

export interface IDailyPoint {
  day: string
  salesCount: number
  revenue: number
  profit: number
}

export interface IDailyPointRow {
  day: Date
  sales_count: string
  revenue: string
  cost: string
}

export interface IZReport {
  number: string
  device: string
  createdAt: string
}

export interface IExportFile {
  fileName: string
  content: string
}
