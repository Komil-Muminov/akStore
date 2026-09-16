import { PRESET_DAYS, ReportPreset, type IReportDay, type IReportPeriod } from './model'

const DAY_MS = 24 * 60 * 60 * 1000
const DISPLAY_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/
const LOCALE = 'ru-RU'
const dayFormat = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: 'short' })
const fullFormat = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' })
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const pad = (value: number) => String(value).padStart(2, '0')

export const toIsoDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const fromIsoDate = (iso: string) => new Date(`${iso}T00:00:00`)

export const toDisplayDate = (iso: string) => fullFormat.format(fromIsoDate(iso))

export const toShortDate = (iso: string) => dayFormat.format(fromIsoDate(iso))

export const parseDisplayDate = (value: string): string | null => {
  const match = DISPLAY_PATTERN.exec(value.trim())
  if (!match) return null
  const [, day, month, year] = match
  const iso = `${year}-${month}-${day}`
  const date = fromIsoDate(iso)
  return Number.isNaN(date.getTime()) || toIsoDate(date) !== iso ? null : iso
}

export const presetPeriod = (preset: ReportPreset, today = new Date()): IReportPeriod => {
  const to = toIsoDate(today)
  const from = toIsoDate(new Date(today.getTime() - PRESET_DAYS[preset] * DAY_MS))
  return { from, to }
}

export const periodQuery = (period: IReportPeriod) => `from=${period.from}&to=${period.to}`

export const exportFileName = (period: IReportPeriod) => `gatePass-отчёт-${period.from}-${period.to}.xlsx`

export const toShortDateTime = (iso: string) => dateTimeFormat.format(new Date(iso))

export const fillDays = (period: IReportPeriod, days: IReportDay[]): IReportDay[] => {
  const known = new Map(days.map((day) => [day.date, day]))
  const result: IReportDay[] = []
  const end = fromIsoDate(period.to).getTime()
  for (let time = fromIsoDate(period.from).getTime(); time <= end; time += DAY_MS) {
    const date = toIsoDate(new Date(time))
    result.push(known.get(date) ?? { date, issued: 0, revoked: 0 })
  }
  return result
}
