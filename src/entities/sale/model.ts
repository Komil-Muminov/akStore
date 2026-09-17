export enum PaymentKind {
  CASH = 'cash',
  CARD = 'card',
}

export interface ICartLine {
  productId: string
  name: string
  unit: string
  price: number
  quantity: number
  stock: number
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

export interface IShiftTotals {
  salesCount: number
  cashTotal: number
  cardTotal: number
  refundTotal: number
  revenue: number
  expectedCash: number
}

export interface IShiftState {
  shift: IShift
  totals: IShiftTotals
}

export const FISCAL_LABEL = 'Фискальный'
export const NOT_FISCAL_LABEL = 'Без фискализации'

export const PAYMENT_LABELS: Record<PaymentKind, string> = {
  [PaymentKind.CASH]: 'Наличные',
  [PaymentKind.CARD]: 'Карта',
}
