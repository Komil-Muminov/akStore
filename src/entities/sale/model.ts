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
  vatRate: number
}

export interface ISaleItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  total: number
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

export interface IFiscalStatus {
  mode: string
  transport: string
  enabled: boolean
  online: boolean
  device: string
  pending: number
  message: string
}

export interface IFiscalReport {
  number: string
  device: string
  total: number
  cashTotal: number
  cardTotal: number
  refundTotal: number
  vatTotal: number
  createdAt: string
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
  vatTotal: number
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
  report?: IFiscalReport | null
}

export const FISCAL_LABEL = 'Фискальный'
export const NOT_FISCAL_LABEL = 'Без фискализации'
export const VAT_LABEL = 'в т. ч. НДС'
export const VAT_BASE = 100
export const FISCAL_ONLINE_LABEL = 'ККМ на связи'
export const FISCAL_OFFLINE_LABEL = 'ККМ не отвечает'
export const FISCAL_OFF_LABEL = 'Без ККМ'
export const FISCAL_QUEUE_LABEL = 'В очереди'

export const PAYMENT_LABELS: Record<PaymentKind, string> = {
  [PaymentKind.CASH]: 'Наличные',
  [PaymentKind.CARD]: 'Карта',
}
