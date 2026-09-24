export { type IShift, type IShiftRow, type IShiftTotals, type IShiftTotalsRow } from './shifts'

export enum PaymentKind {
  CASH = 'cash',
  CARD = 'card',
  MIXED = 'mixed',
  DEBT = 'debt',
}

export interface ISaleItemInput {
  productId: string
  quantity: number
  discount: number
}

export interface IRefundItemInput {
  itemId: string
  quantity: number
}

export interface IRefundInput {
  items: IRefundItemInput[]
}

export interface ISaleInput {
  items: ISaleItemInput[]
  discount: number
  cashPaid: number
  cardPaid: number
  debtPaid?: number
  debtorId?: string | null
}

export interface ISaleItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  discount: number
  total: number
  vatRate: number
  vatAmount: number
  markCode: string
  refunded: number
}

export interface IFiscalTaskRow {
  id: string
  sale_id: string
  kind: string
  attempts: string
  last_error: string
}

export interface IFiscalStamp {
  number: string
  sign: string
  device: string
  qr: string
}

export interface ISaleRecord {
  shiftId: string
  cashierId: string
  outletId: string | null
  payment: PaymentKind
  total: number
  discount: number
  paid: number
  cashAmount: number
  cardAmount: number
  debtAmount: number
  debtorId: string | null
  vatTotal: number
}

export interface ISaleItemRecord {
  productId: string
  name: string
  quantity: number
  price: number
  discount: number
  costPrice: number
  vatRate: number
  vatAmount: number
  markCode: string
}

export interface IFiscalReceipt {
  number: string
  sign: string
  device: string
  qr: string
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
  cashAmount: number
  cardAmount: number
  debtAmount: number
  debtorId: string | null
  debtorName: string | null
  change: number
  vatTotal: number
  refundTotal: number
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
  cash_amount: string
  card_amount: string
  debt_amount: string
  debtor_id: string | null
  debtor_name: string | null
  vat_total: string
  refund_total: string
  refunded_at: Date | null
  created_at: Date
  fiscal_number: string
  fiscal_sign: string
  fiscal_device: string
  fiscal_qr: string
  fiscal_at: Date | null
}

export interface ISaleItemRow {
  id: string
  sale_id: string
  product_id: string
  name: string
  quantity: string
  price: string
  discount: string
  vat_rate: string
  vat_amount: string
  mark_code: string
  refunded: string
}
