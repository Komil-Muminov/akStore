import { HttpError, HttpStatus } from '../shared/utils'
import type { IReportPeriod } from '../types'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MAX_RANGE_DAYS = 366
const DAY_MS = 24 * 60 * 60 * 1000

const parseDate = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
    throw new HttpError(HttpStatus.BAD_REQUEST, `Параметр ${field} должен быть датой в формате ГГГГ-ММ-ДД`)
  }
  return value
}

export const parsePeriod = (query: Record<string, unknown>): IReportPeriod => {
  const from = parseDate(query.from, 'from')
  const to = parseDate(query.to, 'to')
  const span = (Date.parse(to) - Date.parse(from)) / DAY_MS
  if (span < 0) throw new HttpError(HttpStatus.BAD_REQUEST, 'Дата «по» раньше даты «с»')
  if (span > MAX_RANGE_DAYS) throw new HttpError(HttpStatus.BAD_REQUEST, `Период не больше ${MAX_RANGE_DAYS} дней`)
  return { from, to }
}
