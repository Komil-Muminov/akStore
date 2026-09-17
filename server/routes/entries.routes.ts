import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { entriesService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole, type IAuthUser } from '../types'
import { parseEntriesParams, parsePassCode } from './entries.validation'
import { idOf, respond } from './respond'

const guard = rbacMiddleware(UserRole.ADMIN)
const anyRole = rbacMiddleware(UserRole.EMPLOYEE)
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

export const entriesRouter = Router()

entriesRouter.get('/on-site', anyRole, respond(() => entriesService.onSite()))
entriesRouter.get('/search', anyRole, respond((req) => entriesService.search(parseEntriesParams(req.query))))
entriesRouter.get('/find/:code', guard, respond((req) => entriesService.findByCode(parsePassCode(req.params.code))))
entriesRouter.post('/check-in/:id', guard, respond(
  (req) => entriesService.checkIn(actorOf(req), idOf(req)),
  HttpStatus.CREATED,
))
entriesRouter.post('/check-out/:id', guard, respond(
  (req) => entriesService.checkOut(actorOf(req), idOf(req)),
  HttpStatus.CREATED,
))
