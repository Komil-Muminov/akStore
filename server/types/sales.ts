export enum PaymentKind {
  CASH = 'cash',
  CARD = 'card',
}

export interface IShift {
  id: string
  number: number
  cashierId: string
  cashierName: string
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
}

export interface IShiftTotalsRow {
  sales_count: string
  cash_total: string
  card_total: string
  refund_total: string
}

export interface ISaleItemInput {
  productId: string
  quantity: number
}

export interface ISaleInput {
  items: ISaleItemInput[]
  payment: PaymentKind
  discount: number
  paid: number
}

export interface ISaleItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  total: number
}

export interface IFiscalReceipt {
  number: string
  sign: string
  device: string
  registeredAt: string
}

export interface ISale {
  id: string
  number: number
  shiftId: string
  cashierName: string
  payment: PaymentKind
  total: number
  discount: number
  paid: number
  change: number
  refundedAt: string | null
  createdAt: string
  fiscal: IFiscalReceipt | null
  items: ISaleItem[]
}

export interface ISaleRow {
  id: string
  number: number
  shift_id: string
  cashier_name: string
  payment: PaymentKind
  total: string
  discount: string
  paid: string
  refunded_at: Date | null
  created_at: Date
  fiscal_number: string
  fiscal_sign: string
  fiscal_device: string
  fiscal_at: Date | null
}

export interface ISaleItemRow {
  id: string
  sale_id: string
  product_id: string
  name: string
  quantity: string
  price: string
}

export interface ISalesParams {
  shiftId?: string
  from?: string
  to?: string
  limit?: number
}
