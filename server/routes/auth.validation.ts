import { HttpError, HttpStatus, requireString } from '../shared/utils'
import { UserRole, type IUserInput } from '../types'

const LOGIN_MIN = 2
const LOGIN_MAX = 64
const PASSWORD_MIN = 3
const PASSWORD_MAX = 128
const NAME_MAX = 120
const LOGIN_PATTERN = /^[a-z0-9._-]+$/i
const ASSIGNABLE_ROLES = [UserRole.ADMIN, UserRole.GUARD, UserRole.EMPLOYEE]

export const parseLogin = (value: unknown): string => {
  const login = requireString(value, 'login', LOGIN_MIN, LOGIN_MAX).toLowerCase()
  if (!LOGIN_PATTERN.test(login)) throw new HttpError(HttpStatus.BAD_REQUEST, 'Логин: только латиница, цифры, точка, дефис')
  return login
}

export const parsePassword = (value: unknown, field = 'password'): string =>
  requireString(value, field, PASSWORD_MIN, PASSWORD_MAX)

export const parseCredentials = (body: unknown) => {
  const raw = (body ?? {}) as Record<string, unknown>
  return { login: parseLogin(raw.login), password: parsePassword(raw.password) }
}

export const parsePasswordChange = (body: unknown) => {
  const raw = (body ?? {}) as Record<string, unknown>
  return { current: parsePassword(raw.current, 'current'), next: parsePassword(raw.next, 'next') }
}

export const parseUserInput = (body: unknown): IUserInput => {
  const raw = (body ?? {}) as Record<string, unknown>
  const role = raw.role as UserRole
  if (!ASSIGNABLE_ROLES.includes(role)) throw new HttpError(HttpStatus.BAD_REQUEST, 'Недопустимая роль')
  return {
    login: parseLogin(raw.login),
    password: parsePassword(raw.password),
    role,
    fullName: requireString(raw.fullName, 'fullName', LOGIN_MIN, NAME_MAX),
  }
}

export const parseUserUpdate = (body: unknown) => {
  const raw = (body ?? {}) as Record<string, unknown>
  return { fullName: requireString(raw.fullName, 'fullName', LOGIN_MIN, NAME_MAX), isActive: raw.isActive !== false }
}
