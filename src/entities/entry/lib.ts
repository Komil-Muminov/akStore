const LOCALE = 'ru-RU'
const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
const FULL_OPTIONS: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }
const MINUTE_MS = 60_000
const HOUR_MINUTES = 60
const HOURS_LABEL = ' ч '
const MINUTES_LABEL = ' мин'

export const entryTimeOf = (iso: string) => new Date(iso).toLocaleTimeString(LOCALE, TIME_OPTIONS)

export const entryStampOf = (iso: string) => new Date(iso).toLocaleString(LOCALE, FULL_OPTIONS)

export const durationOf = (iso: string) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / MINUTE_MS))
  const hours = Math.floor(minutes / HOUR_MINUTES)
  const rest = minutes % HOUR_MINUTES
  return hours > 0 ? `${String(hours)}${HOURS_LABEL}${String(rest)}${MINUTES_LABEL}` : `${String(rest)}${MINUTES_LABEL}`
}
