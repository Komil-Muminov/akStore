import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { cashService, debtsService } from '../services'
import { HttpError, HttpStatus, optionalString, requireString } from '../shared/utils'
import { CashMoveKind, UserRole, type IAuthUser } from '../types'
import { parseCash, parseNote } from './retail.validation'
import { idOf, respond } from './respond'

const NAME_MIN = 2
const NAME_MAX = 120
const PHONE_MAX = 32
const KIND_ERROR = 'Неизвестная операция с кассой'

const anyRole = rbacMiddleware(UserRole.EMPLOYEE)
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

const kindOf = (value: unknown) => {
  const text = String(value ?? '')
  if (!Object.values(CashMoveKind).includes(text as CashMoveKind)) {
    throw new HttpError(HttpStatus.BAD_REQUEST, KIND_ERROR)
  }
  return text as CashMoveKind
}

const debtorOf = (body: unknown) => {
  const raw = (body ?? {}) as Record<string, unknown>
  return {
    name: requireString(raw.name, 'name', NAME_MIN, NAME_MAX),
    phone: optionalString(raw.phone, 'phone', PHONE_MAX),
    note: optionalString(raw.note, 'note', NAME_MAX),
  }
}

export const cashRouter = Router()

cashRouter.get('/list', anyRole, respond((req) => cashService.list(actorOf(req))))
cashRouter.post('/move', anyRole, respond(
  (req) =>
    cashService.move(
      actorOf(req),
      kindOf((req.body as Record<string, unknown>).kind),
      parseCash(req.body, 'amount'),
      parseNote(req.body),
    ),
  HttpStatus.CREATED,
))

export const debtsRouter = Router()

debtsRouter.get('/search', anyRole, respond((req) =>
  debtsService.search(typeof req.query.q === 'string' ? req.query.q : ''),
))
debtsRouter.get('/find/:id', anyRole, respond((req) => debtsService.find(idOf(req))))
debtsRouter.post('/create', anyRole, respond((req) => debtsService.create(debtorOf(req.body)), HttpStatus.CREATED))
debtsRouter.patch('/update/:id', anyRole, respond((req) => debtsService.update(idOf(req), debtorOf(req.body))))
debtsRouter.delete('/delete/:id', anyRole, respond((req) => debtsService.archive(idOf(req))))
debtsRouter.post('/lend/:id', anyRole, respond((req) =>
  debtsService.lend(actorOf(req), idOf(req), parseCash(req.body, 'amount'), parseNote(req.body)),
))
debtsRouter.post('/repay/:id', anyRole, respond((req) =>
  debtsService.repay(actorOf(req), idOf(req), parseCash(req.body, 'amount'), parseNote(req.body)),
))
