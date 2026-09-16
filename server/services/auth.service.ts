import jwt from 'jsonwebtoken'
import { config } from '../config'
import { usersDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import type { IAuthUser, ITokenPayload, IUserRow } from '../types'

const BAD_CREDENTIALS = 'Неверный логин или пароль'
const INACTIVE = 'Учётная запись отключена'
const BAD_TOKEN = 'Сессия недействительна, войдите заново'
const BAD_CURRENT = 'Текущий пароль неверный'

const toAuthUser = (row: IUserRow): IAuthUser => ({ id: row.id, login: row.login, role: row.role, fullName: row.full_name })

const sign = (row: IUserRow): string => {
  const payload: ITokenPayload = { sub: row.id, role: row.role }
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.tokenTtl } as jwt.SignOptions)
}

export const authService = {
  login: async (login: string, password: string) => {
    const row = await usersDb.findRowByLogin(login)
    const valid = row ? await Bun.password.verify(password, row.password_hash) : false
    if (!row || !valid) throw new HttpError(HttpStatus.UNAUTHORIZED, BAD_CREDENTIALS)
    if (!row.is_active) throw new HttpError(HttpStatus.FORBIDDEN, INACTIVE)
    return { token: sign(row), user: toAuthUser(row) }
  },
  verify: async (token: string) => {
    let payload: ITokenPayload
    try {
      payload = jwt.verify(token, config.jwtSecret) as ITokenPayload
    } catch {
      throw new HttpError(HttpStatus.UNAUTHORIZED, BAD_TOKEN)
    }
    const row = await usersDb.findRow(payload.sub)
    if (!row || !row.is_active) throw new HttpError(HttpStatus.UNAUTHORIZED, BAD_TOKEN)
    return toAuthUser(row)
  },
  changePassword: async (userId: string, current: string, next: string) => {
    const row = await usersDb.findRow(userId)
    const valid = row ? await Bun.password.verify(current, row.password_hash) : false
    if (!row || !valid) throw new HttpError(HttpStatus.BAD_REQUEST, BAD_CURRENT)
    await usersDb.setPassword(userId, await Bun.password.hash(next))
    return { ok: true }
  },
}
