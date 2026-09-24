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

export const periodRangeOf = (period: PeriodKind): { from?: string; to?: string } => {
  if (period === PeriodKind.TODAY) return { from: startOfDay().toISOString() }
  if (period === PeriodKind.YESTERDAY) {
    return {
      from: shiftDays(1).toISOString(),
      to: startOfDay().toISOString(),
    }
  }
  if (period === PeriodKind.WEEK) return { from: shiftDays(WEEK_DAYS).toISOString() }
  if (period === PeriodKind.MONTH) return { from: shiftDays(MONTH_DAYS).toISOString() }
  return {}
}

export const periodStartOf = (period: PeriodKind) => periodRangeOf(period).from ?? ''

export const dayLabelOf = (iso: string) => new Date(iso).toLocaleDateString(LOCALE, DAY_OPTIONS)

export const hourLabelOf = (hour: number) => `${String(hour).padStart(2, '0')}:00`

export const percentOf = (value: number) => `${value.toFixed(1)}%`
