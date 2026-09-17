import { VAT_BASE, type ICartLine } from './model'

const LOCALE = 'ru-RU'
const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
const STAMP_OPTIONS: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }

export const lineTotalOf = (line: ICartLine) => Math.round(line.price * line.quantity * 100) / 100

export const cartSubtotalOf = (lines: ICartLine[]) =>
  Math.round(lines.reduce((sum, line) => sum + lineTotalOf(line), 0) * 100) / 100

export const cartTotalOf = (lines: ICartLine[], discount: number) =>
  Math.max(0, Math.round((cartSubtotalOf(lines) - discount) * 100) / 100)

export const lineVatOf = (line: ICartLine) =>
  line.vatRate <= 0 ? 0 : Math.round(((lineTotalOf(line) * line.vatRate) / (VAT_BASE + line.vatRate)) * 100) / 100

export const cartVatOf = (lines: ICartLine[], discount: number) => {
  const subtotal = cartSubtotalOf(lines)
  if (subtotal <= 0) return 0
  const ratio = Math.max(0, subtotal - discount) / subtotal
  return Math.round(lines.reduce((sum, line) => sum + lineVatOf(line) * ratio, 0) * 100) / 100
}

export const changeOf = (total: number, paid: number) => Math.max(0, Math.round((paid - total) * 100) / 100)

export const saleTimeOf = (iso: string) => new Date(iso).toLocaleTimeString(LOCALE, TIME_OPTIONS)

export const saleStampOf = (iso: string) => new Date(iso).toLocaleString(LOCALE, STAMP_OPTIONS)
