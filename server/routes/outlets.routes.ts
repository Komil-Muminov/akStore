import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { outletsService } from '../services'
import { HttpStatus, optionalString, requireString, requireUuid } from '../shared/utils'
import { UserRole, type IAuthUser, type ITransferInput } from '../types'
import { idOf, respond } from './respond'

const NAME_MIN = 2
const NAME_MAX = 120
const ADDRESS_MAX = 200
const PHONE_MAX = 32
const NOTE_MAX = 200
const QUANTITY_MAX = 100_000
const QUANTITY_ERROR = 'Количество должно быть больше нуля'

const manager = rbacMiddleware(UserRole.ADMIN)
const anyRole = rbacMiddleware(UserRole.EMPLOYEE)
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

const outletOf = (body: unknown) => {
  const raw = (body ?? {}) as Record<string, unknown>
  return {
    name: requireString(raw.name, 'name', NAME_MIN, NAME_MAX),
    address: optionalString(raw.address, 'address', ADDRESS_MAX),
    phone: optionalString(raw.phone, 'phone', PHONE_MAX),
  }
}

const transferOf = (body: unknown): ITransferInput => {
  const raw = (body ?? {}) as Record<string, unknown>
  const parsed = Number(raw.quantity)
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > QUANTITY_MAX) {
    throw new Error(QUANTITY_ERROR)
  }
  return {
    productId: requireUuid(raw.productId, 'productId'),
    fromOutletId: requireUuid(raw.fromOutletId, 'fromOutletId'),
    toOutletId: requireUuid(raw.toOutletId, 'toOutletId'),
    quantity: Math.round(parsed * 1000) / 1000,
    note: optionalString(raw.note, 'note', NOTE_MAX),
  }
}

export const outletsRouter = Router()

outletsRouter.get('/list', anyRole, respond(() => outletsService.list()))
outletsRouter.get('/stocks/:id', anyRole, respond((req) => outletsService.stocks(idOf(req))))
outletsRouter.post('/create', manager, respond((req) => outletsService.create(outletOf(req.body)), HttpStatus.CREATED))
outletsRouter.patch('/update/:id', manager, respond((req) => outletsService.update(idOf(req), outletOf(req.body))))
outletsRouter.delete('/delete/:id', manager, respond((req) => outletsService.archive(idOf(req))))
outletsRouter.post('/transfer', manager, respond((req) => outletsService.transfer(actorOf(req), transferOf(req.body))))
