import { PassFilter, PassStatus, type IPass } from './model'

const LOCALE = 'ru-RU'
const INITIALS_LIMIT = 2
const dateFormat = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' })
const timeFormat = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' })

export const matchesFilter = (pass: IPass, filter: PassFilter): boolean =>
  filter === PassFilter.ALL ||
  (filter === PassFilter.ACTIVE && pass.status === PassStatus.ACTIVE) ||
  (filter === PassFilter.REVOKED && pass.status === PassStatus.REVOKED)

export const matchesQuery = (pass: IPass, query: string): boolean =>
  pass.holderName.toLowerCase().includes(query.trim().toLowerCase())

export const formatIssuedAt = (iso: string): string => {
  const date = new Date(iso)
  return `${dateFormat.format(date)}, ${timeFormat.format(date)}`
}

export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, INITIALS_LIMIT)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
