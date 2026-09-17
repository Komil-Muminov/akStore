import type { IFiscalStamp, PaymentKind } from '../types'

export enum FiscalMode {
  DISABLED = 'disabled',
  EMULATOR = 'emulator',
}

export enum FiscalTransportKind {
  NONE = 'none',
  TCP = 'tcp',
  SERIAL = 'serial',
}

export enum FiscalDocumentKind {
  SALE = 'sale',
  REFUND = 'refund',
}

export interface IFiscalLine {
  name: string
  quantity: number
  price: number
  total: number
  vatRate: number
  vatAmount: number
  markCode: string
}

export interface IFiscalDocument {
  kind: FiscalDocumentKind
  saleId: string
  number: number
  cashierName: string
  payment: PaymentKind
  discount: number
  total: number
  paid: number
  change: number
  vatTotal: number
  createdAt: string
  lines: IFiscalLine[]
}

export interface IFiscalStatus {
  mode: FiscalMode
  transport: FiscalTransportKind
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

export interface IFiscalDriver {
  readonly mode: FiscalMode
  readonly enabled: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  probe: () => Promise<boolean>
  device: () => string
  register: (document: IFiscalDocument) => Promise<IFiscalStamp | null>
  openShift: (cashierName: string) => Promise<void>
  closeShift: (cashierName: string) => Promise<IFiscalReport | null>
}

export const FISCAL_UNAVAILABLE = 'Фискальный регистратор не отвечает'
export const FISCAL_NOT_CONFIGURED = 'Фискальный регистратор не подключён'
export const FISCAL_QUEUED = 'Чек принят в очередь фискализации'
