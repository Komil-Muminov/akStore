import { Router, type NextFunction, type Request, type Response } from 'express'
import { rbacMiddleware } from '../middleware'
import { passesService } from '../services'
import { HttpStatus, requireUuid } from '../shared/utils'
import { UserRole } from '../types'
import { parsePassInput } from './passes.validation'

type THandler = (req: Request) => Promise<unknown>

const respond =
  (handler: THandler, status: number = HttpStatus.OK) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(status).json({ data: await handler(req) })
    } catch (error) {
      next(error)
    }
  }

const idOf = (req: Request) => requireUuid(req.params.id, 'id')
const admin = rbacMiddleware(UserRole.ADMIN)
const anyRole = rbacMiddleware(UserRole.ADMIN, UserRole.GUARD)

export const passesRouter = Router()

passesRouter.get('/search', anyRole, respond(() => passesService.search()))
passesRouter.post('/create', admin, respond((req) => passesService.create(parsePassInput(req.body)), HttpStatus.CREATED))
passesRouter.patch('/update/:id', admin, respond((req) => passesService.update(idOf(req), parsePassInput(req.body))))
passesRouter.patch('/deactivate/:id', admin, respond((req) => passesService.deactivate(idOf(req))))
passesRouter.patch('/activate/:id', admin, respond((req) => passesService.activate(idOf(req))))
passesRouter.delete('/delete/:id', admin, respond((req) => passesService.remove(idOf(req))))
