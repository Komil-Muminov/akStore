import { config } from '../config'
import type { ISale } from '../types'
import { FiscalDocumentKind, type IFiscalDocument, type IFiscalLine } from './model'

const VAT_BASE = 100

export const vatAmountOf = (total: number, rate: number) =>
  rate <= 0 ? 0 : Math.round(((total * rate) / (VAT_BASE + rate)) * 100) / 100

const lineOf = (item: ISale['items'][number]): IFiscalLine => ({
  name: item.name,
  quantity: item.quantity,
  price: item.price,
  total: item.total,
  vatRate: item.vatRate,
  vatAmount: item.vatAmount,
  markCode: item.markCode,
})

export const documentOf = (sale: ISale, kind: FiscalDocumentKind): IFiscalDocument => ({
  kind,
  saleId: sale.id,
  number: sale.number,
  cashierName: sale.cashierName,
  payment: sale.payment,
  discount: sale.discount,
  total: sale.total,
  paid: sale.paid,
  change: sale.change,
  vatTotal: sale.vatTotal,
  createdAt: sale.createdAt,
  lines: sale.items.map(lineOf),
})

export const qrOf = (document: IFiscalDocument, number: string, sign: string, device: string) =>
  config.fiscal.qrTemplate
    .replace('{device}', device)
    .replace('{number}', number)
    .replace('{sign}', sign)
    .replace('{total}', document.total.toFixed(2))
    .replace('{time}', document.createdAt)
