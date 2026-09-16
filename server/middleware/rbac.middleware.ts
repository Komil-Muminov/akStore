import type { NextFunction, Request, Response } from 'express'
import { HttpError, HttpStatus } from '../shared/utils'
import type { UserRole } from '../types'

export const rbacMiddleware =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role
    const allowed = role !== undefined && roles.includes(role)
    next(allowed ? undefined : new HttpError(HttpStatus.FORBIDDEN, 'Доступ запрещён'))
  }
