import { PeriodKind } from './model'

const DAY_MS = 86_400_000
const WEEK_DAYS = 7
const MONTH_DAYS = 30
const LOCALE = 'ru-RU'
const DAY_OPTIONS: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' }

const startOfDay = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

const shiftDays = (days: number) => new Date(startOfDay().getTime() - days * DAY_MS)

export const periodStartOf = (period: PeriodKind) => {
  if (period === PeriodKind.TODAY) return startOfDay().toISOString()
  if (period === PeriodKind.WEEK) return shiftDays(WEEK_DAYS).toISOString()
  if (period === PeriodKind.MONTH) return shiftDays(MONTH_DAYS).toISOString()
  return ''
}

export const dayLabelOf = (iso: string) => new Date(iso).toLocaleDateString(LOCALE, DAY_OPTIONS)

export const percentOf = (value: number) => `${value.toFixed(1)}%`
