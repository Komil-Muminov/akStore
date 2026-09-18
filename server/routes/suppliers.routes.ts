import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { suppliersService } from '../services'
import { HttpError, HttpStatus, optionalString, requireString, requireUuid } from '../shared/utils'
import { UserRole, type IAuthUser, type IInvoiceInput } from '../types'
import { idOf, respond } from './respond'

const NAME_MIN = 2
const NAME_MAX = 120
const PHONE_MAX = 32
const NOTE_MAX = 200
const ITEMS_MAX = 500
const MONEY_MAX = 99_999_999
const ITEMS_ERROR = `В накладной должно быть от 1 до ${ITEMS_MAX} позиций`
const MONEY_ERROR = 'Сумма указана неверно'

const manager = rbacMiddleware(UserRole.ADMIN)
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

const money = (value: unknown) => {
  const parsed = Number(value ?? 0)
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > MONEY_MAX) {
    throw new HttpError(HttpStatus.BAD_REQUEST, MONEY_ERROR)
  }
  return Math.round(parsed * 100) / 100
}

const supplierOf = (body: unknown) => {
  const raw = (body ?? {}) as Record<string, unknown>
  return {
    name: requireString(raw.name, 'name', NAME_MIN, NAME_MAX),
    phone: optionalString(raw.phone, 'phone', PHONE_MAX),
    note: optionalString(raw.note, 'note', NOTE_MAX),
  }
}

const invoiceOf = (body: unknown): IInvoiceInput => {
  const raw = (body ?? {}) as Record<string, unknown>
  const items = Array.isArray(raw.items) ? raw.items : []
  if (items.length === 0 || items.length > ITEMS_MAX) throw new HttpError(HttpStatus.BAD_REQUEST, ITEMS_ERROR)
  return {
    supplierId: requireUuid(raw.supplierId, 'supplierId'),
    paid: money(raw.paid),
    note: optionalString(raw.note, 'note', NOTE_MAX),
    items: (items as Record<string, unknown>[]).map((item) => ({
      productId: requireUuid(item.productId, 'productId'),
      quantity: money(item.quantity),
      costPrice: money(item.costPrice),
    })),
  }
}

export const suppliersRouter = Router()

suppliersRouter.get('/search', manager, respond((req) =>
  suppliersService.search(typeof req.query.q === 'string' ? req.query.q : ''),
))
suppliersRouter.get('/invoices', manager, respond((req) =>
  suppliersService.invoices(typeof req.query.supplier === 'string' ? req.query.supplier : null),
))
suppliersRouter.post('/create', manager, respond((req) => suppliersService.create(supplierOf(req.body)), HttpStatus.CREATED))
suppliersRouter.patch('/update/:id', manager, respond((req) => suppliersService.update(idOf(req), supplierOf(req.body))))
suppliersRouter.delete('/delete/:id', manager, respond((req) => suppliersService.archive(idOf(req))))
suppliersRouter.post('/receive', manager, respond(
  (req) => suppliersService.receive(actorOf(req), invoiceOf(req.body)),
  HttpStatus.CREATED,
))
suppliersRouter.post('/pay/:id', manager, respond((req) =>
  suppliersService.payInvoice(idOf(req), money((req.body as Record<string, unknown>).amount)),
))
