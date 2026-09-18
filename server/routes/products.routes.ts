import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { productsService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole, type IAuthUser } from '../types'
import {
  parseCategoryName,
  parseInventoryInput,
  parseProductInput,
  parseStockInput,
} from './retail.validation'
import { idOf, respond } from './respond'

const manager = rbacMiddleware(UserRole.ADMIN)
const anyRole = rbacMiddleware(UserRole.EMPLOYEE)
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

const HTML_TYPE = 'text/html; charset=utf-8'
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const IDS_MAX = 200

export const productsRouter = Router()

productsRouter.get('/labels', manager, async (req, res, next) => {
  try {
    const raw = typeof req.query.ids === 'string' ? req.query.ids : ''
    const ids = raw.split(',').filter((id) => UUID_PATTERN.test(id)).slice(0, IDS_MAX)
    res.setHeader('Content-Type', HTML_TYPE)
    res.send(await productsService.labels(ids))
  } catch (error) {
    next(error)
  }
})

productsRouter.get('/search', anyRole, respond((req) => productsService.search({
  query: typeof req.query.q === 'string' ? req.query.q : undefined,
  categoryId: typeof req.query.category === 'string' ? req.query.category : undefined,
  favorite: req.query.favorite === 'true',
  lowStock: req.query.low === 'true',
  page: typeof req.query.page === 'string' ? Number(req.query.page) : undefined,
  limit: typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined,
})))
productsRouter.get('/barcode/:code', anyRole, respond((req) => productsService.findByBarcode(String(req.params.code))))
productsRouter.get('/categories', anyRole, respond(() => productsService.categories()))
productsRouter.get('/history', manager, respond((req) =>
  productsService.history(typeof req.query.product === 'string' ? req.query.product : null),
))
productsRouter.post('/create', manager, respond((req) => productsService.create(parseProductInput(req.body)), HttpStatus.CREATED))
productsRouter.patch('/update/:id', manager, respond((req) => productsService.update(idOf(req), parseProductInput(req.body))))
productsRouter.delete('/delete/:id', manager, respond((req) => productsService.archive(idOf(req))))
productsRouter.post('/category-create', manager, respond((req) => productsService.createCategory(parseCategoryName(req.body)), HttpStatus.CREATED))
productsRouter.patch('/category-update/:id', manager, respond((req) => productsService.renameCategory(idOf(req), parseCategoryName(req.body))))
productsRouter.delete('/category-delete/:id', manager, respond((req) => productsService.removeCategory(idOf(req))))
productsRouter.post('/income', manager, respond((req) => productsService.income(actorOf(req), parseStockInput(req.body)), HttpStatus.CREATED))
productsRouter.post('/write-off', manager, respond((req) => productsService.writeOff(actorOf(req), parseStockInput(req.body)), HttpStatus.CREATED))
productsRouter.post('/inventory', manager, respond((req) => productsService.inventory(actorOf(req), parseInventoryInput(req.body)), HttpStatus.CREATED))
