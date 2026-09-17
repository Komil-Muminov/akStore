import { HttpError, HttpStatus, requireString } from '../shared/utils'
import type { IEntriesParams } from '../types'

const CODE_MIN = 3
const CODE_MAX = 32
const LIMIT_MAX = 500
const DATE_ERROR = 'Дата указана неверно'

const optionalDate = (value: unknown, field: string) => {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) throw new HttpError(HttpStatus.BAD_REQUEST, `${DATE_ERROR}: ${field}`)
  return parsed.toISOString()
}

export const parsePassCode = (value: unknown) => requireString(value, 'code', CODE_MIN, CODE_MAX).toUpperCase()

export const parseEntriesParams = (query: unknown): IEntriesParams => {
  const raw = (query ?? {}) as Record<string, unknown>
  const limit = Number(raw.limit)
  return {
    from: optionalDate(raw.from, 'from'),
    to: optionalDate(raw.to, 'to'),
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, LIMIT_MAX) : undefined,
  }
}
