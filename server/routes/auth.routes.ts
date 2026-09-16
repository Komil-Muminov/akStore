import { Router } from 'express'
import { authService } from '../services'
import type { IAuthUser } from '../types'
import { parseCredentials, parsePasswordChange } from './auth.validation'
import { respond } from './respond'

export const authRouter = Router()

authRouter.post('/login', respond((req) => {
  const { login, password } = parseCredentials(req.body)
  return authService.login(login, password)
}))
authRouter.get('/me', respond(async (req) => req.user as IAuthUser))
authRouter.post('/change-password', respond((req) => {
  const { current, next } = parsePasswordChange(req.body)
  return authService.changePassword((req.user as IAuthUser).id, current, next)
}))
