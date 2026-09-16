import type { NextFunction, Request, Response } from 'express'
import { config } from '../config'
import { HttpError, HttpStatus, INTERNAL_ERROR_MESSAGE } from '../shared/utils'

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const known = error instanceof HttpError
  const status = known ? error.status : HttpStatus.INTERNAL
  const message = known ? error.message : config.isProduction ? INTERNAL_ERROR_MESSAGE : String(error)
  if (!known) console.error(error)
  res.status(status).json({ message })
}
