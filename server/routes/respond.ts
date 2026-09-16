import type { NextFunction, Request, Response } from 'express'
import { HttpStatus, requireUuid } from '../shared/utils'

type THandler = (req: Request) => Promise<unknown>

export const respond =
  (handler: THandler, status: number = HttpStatus.OK) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(status).json({ data: await handler(req) })
    } catch (error) {
      next(error)
    }
  }

export const idOf = (req: Request) => requireUuid(req.params.id, 'id')
