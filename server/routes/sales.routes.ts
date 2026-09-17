import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { fiscalService, salesService, shiftsService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole, type IAuthUser } from '../types'
import { parsePageParams, parseReportParams } from './reports.validation'
import { parseCash, parseNote, parseSaleInput } from './retail.validation'
import { idOf, respond } from './respond'

const anyRole = rbacMiddleware(UserRole.EMPLOYEE)
const manager = rbacMiddleware(UserRole.ADMIN)
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

export const shiftsRouter = Router()

shiftsRouter.get('/current', anyRole, respond((req) => shiftsService.current(actorOf(req))))
shiftsRouter.get('/list', manager, respond(() => shiftsService.list()))
shiftsRouter.get('/report/:id', anyRole, respond((req) => shiftsService.report(actorOf(req), idOf(req))))
shiftsRouter.post('/open', anyRole, respond(
  (req) => shiftsService.open(actorOf(req), parseCash(req.body, 'openingCash')),
  HttpStatus.CREATED,
))
shiftsRouter.patch('/close', anyRole, respond((req) =>
  shiftsService.close(actorOf(req), parseCash(req.body, 'closingCash'), parseNote(req.body)),
))

const HTML_TYPE = 'text/html; charset=utf-8'

shiftsRouter.get('/print/:id', anyRole, async (req, res, next) => {
  try {
    const html = await shiftsService.printable(req.user as IAuthUser, idOf(req))
    res.setHeader('Content-Type', HTML_TYPE)
    res.send(html)
  } catch (error) {
    next(error)
  }
})

export const salesRouter = Router()

salesRouter.get('/search', anyRole, respond((req) =>
  salesService.search(parseReportParams(req.query), parsePageParams(req.query)),
))
salesRouter.get('/find/:id', anyRole, respond((req) => salesService.find(idOf(req))))
salesRouter.post('/create', anyRole, respond((req) => salesService.create(actorOf(req), parseSaleInput(req.body)), HttpStatus.CREATED))
salesRouter.post('/refund/:id', anyRole, respond((req) => salesService.refund(actorOf(req), idOf(req))))

export const fiscalRouter = Router()

fiscalRouter.get('/status', anyRole, respond(() => fiscalService.status()))
