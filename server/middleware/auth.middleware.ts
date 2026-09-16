import type { NextFunction, Request, Response } from 'express'
import { authService } from '../services'
import { HttpError, HttpStatus } from '../shared/utils'

const BEARER_PREFIX = 'Bearer '
const PUBLIC_PATHS = ['/auth/login']

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  if (PUBLIC_PATHS.includes(req.path)) {
    next()
    return
  }
  const header = req.headers.authorization ?? ''
  const token = header.startsWith(BEARER_PREFIX) ? header.slice(BEARER_PREFIX.length) : ''
  if (!token) {
    next(new HttpError(HttpStatus.UNAUTHORIZED, 'Требуется вход'))
    return
  }
  try {
    req.user = await authService.verify(token)
    next()
  } catch (error) {
    next(error)
  }
}
