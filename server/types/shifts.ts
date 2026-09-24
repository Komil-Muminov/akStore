export interface IShift {
  id: string
  number: number
  cashierId: string
  cashierName: string
  outletId: string | null
  outletName: string
  openedAt: string
  closedAt: string | null
  openingCash: number
  closingCash: number | null
  note: string
}

export interface IShiftRow {
  id: string
  number: number
  cashier_id: string
  cashier_name: string
  outlet_id: string | null
  outlet_name: string | null
  opened_at: Date
  closed_at: Date | null
  opening_cash: string
  closing_cash: string | null
  note: string
}

export interface IShiftTotals {
  salesCount: number
  cashTotal: number
  cardTotal: number
  refundTotal: number
  revenue: number
  expectedCash: number
  cashAdjustment?: number
}

export interface IShiftTotalsRow {
  sales_count: string
  cash_total: string
  card_total: string
  refund_total: string
}
