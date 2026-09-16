import { HttpError, HttpStatus } from './errors'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const requireString = (value: unknown, field: string, min: number, max: number): string => {
  const text = typeof value === 'string' ? value.trim() : ''
  if (text.length < min || text.length > max) {
    throw new HttpError(HttpStatus.BAD_REQUEST, `Поле ${field} должно быть от ${min} до ${max} символов`)
  }
  return text
}

export const requireUuid = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    throw new HttpError(HttpStatus.BAD_REQUEST, `Поле ${field} должно быть UUID`)
  }
  return value
}
