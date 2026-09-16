import type { NextFunction, Request, Response } from 'express'
import { HttpError, HttpStatus } from '../shared/utils'
import { ROLE_RANK, type UserRole } from '../types'

export const rbacMiddleware =
  (minimalRole: UserRole) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role
    const allowed = role !== undefined && ROLE_RANK[role] <= ROLE_RANK[minimalRole]
    next(allowed ? undefined : new HttpError(HttpStatus.FORBIDDEN, 'Доступ запрещён'))
  }
