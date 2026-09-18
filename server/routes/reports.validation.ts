import { HttpError, HttpStatus } from '../shared/utils'
import { PaymentKind, type IPageParams, type IReportParams } from '../types'

const QUERY_MAX = 80
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 50
const LIMIT_MAX = 200
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DATE_ERROR = 'Дата указана неверно'
const PAYMENT_ERROR = 'Неизвестный способ оплаты'
const UUID_ERROR = 'Идентификатор указан неверно'
const QUERY_ERROR = `Поиск не длиннее ${QUERY_MAX} символов`

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const date = (value: unknown) => {
  const text = asText(value)
  if (text.length === 0) return null
  const parsed = new Date(text)
  if (Number.isNaN(parsed.getTime())) throw new HttpError(HttpStatus.BAD_REQUEST, DATE_ERROR)
  return parsed.toISOString()
}

const uuid = (value: unknown) => {
  const text = asText(value)
  if (text.length === 0) return null
  if (!UUID_PATTERN.test(text)) throw new HttpError(HttpStatus.BAD_REQUEST, UUID_ERROR)
  return text
}

const payment = (value: unknown) => {
  const text = asText(value)
  if (text.length === 0) return null
  if (!Object.values(PaymentKind).includes(text as PaymentKind)) {
    throw new HttpError(HttpStatus.BAD_REQUEST, PAYMENT_ERROR)
  }
  return text as PaymentKind
}

const search = (value: unknown) => {
  const text = asText(value)
  if (text.length > QUERY_MAX) throw new HttpError(HttpStatus.BAD_REQUEST, QUERY_ERROR)
  return text
}

export const parseReportParams = (query: Record<string, unknown>): IReportParams => ({
  from: date(query.from),
  to: date(query.to),
  shiftId: uuid(query.shift),
  outletId: uuid(query.outlet),
  cashierId: uuid(query.cashier),
  payment: payment(query.payment),
  query: search(query.q),
})

export const parsePageParams = (query: Record<string, unknown>): IPageParams => {
  const page = Number(asText(query.page) || DEFAULT_PAGE)
  const limit = Number(asText(query.limit) || DEFAULT_LIMIT)
  return {
    page: Number.isFinite(page) ? Math.max(Math.trunc(page), DEFAULT_PAGE) : DEFAULT_PAGE,
    limit: Number.isFinite(limit) ? Math.min(Math.max(Math.trunc(limit), 1), LIMIT_MAX) : DEFAULT_LIMIT,
  }
}
