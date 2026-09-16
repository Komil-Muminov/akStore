import {
  PASS_NAME_MIN_LENGTH,
  PassFilter,
  PassStatus,
  type IPass,
  type IPassInput,
  type TPassErrors,
} from './model'

const LOCALE = 'ru-RU'
const INITIALS_LIMIT = 2
const REQUIRED_ERROR = `Минимум ${PASS_NAME_MIN_LENGTH} символа`
const HOST_REQUIRED_ERROR = 'Выберите принимающего сотрудника'
const dateFormat = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' })
const timeFormat = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' })

export const matchesFilter = (pass: IPass, filter: PassFilter): boolean =>
  filter === PassFilter.ALL ||
  (filter === PassFilter.ACTIVE && pass.status === PassStatus.ACTIVE) ||
  (filter === PassFilter.REVOKED && pass.status === PassStatus.REVOKED)

export const matchesQuery = (pass: IPass, query: string): boolean => {
  const needle = query.trim().toLowerCase()
  return [pass.holderName, pass.hostName, pass.organization, pass.carPlate].some((value) =>
    value.toLowerCase().includes(needle),
  )
}

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

export const toPassInput = (pass: IPass): IPassInput => ({
  holderName: pass.holderName,
  hostUserId: pass.hostUserId,
  hostName: pass.hostName,
  organization: pass.organization,
  purpose: pass.purpose,
  phone: pass.phone,
  carPlate: pass.carPlate,
})

export const normalizePassInput = (input: IPassInput): IPassInput => ({
  holderName: input.holderName.trim(),
  hostUserId: input.hostUserId,
  hostName: input.hostName.trim(),
  organization: input.organization.trim(),
  purpose: input.purpose.trim(),
  phone: input.phone.trim(),
  carPlate: input.carPlate.trim().toUpperCase(),
})

export const validatePassInput = (input: IPassInput): TPassErrors => {
  const normalized = normalizePassInput(input)
  const errors: TPassErrors = {}
  if (normalized.holderName.length < PASS_NAME_MIN_LENGTH) errors.holderName = REQUIRED_ERROR
  if (!normalized.hostUserId) errors.hostName = HOST_REQUIRED_ERROR
  return errors
}
