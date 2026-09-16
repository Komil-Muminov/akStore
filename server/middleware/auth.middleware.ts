import type { NextFunction, Request, Response } from 'express'
import { config } from '../config'
import { HttpError, HttpStatus } from '../shared/utils'
import { UserRole } from '../types'

const BEARER_PREFIX = 'Bearer '

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith(BEARER_PREFIX) ? header.slice(BEARER_PREFIX.length) : ''
  if (token !== config.apiToken) {
    next(new HttpError(HttpStatus.UNAUTHORIZED, 'Не авторизован'))
    return
  }
  req.user = { role: UserRole.ADMIN }
  next()
}
