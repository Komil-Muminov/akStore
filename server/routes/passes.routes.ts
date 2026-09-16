import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { passesService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole } from '../types'
import { parsePassInput } from './passes.validation'
import { idOf, respond } from './respond'

const admin = rbacMiddleware(UserRole.ADMIN)
const anyRole = rbacMiddleware(UserRole.EMPLOYEE)

export const passesRouter = Router()

passesRouter.get('/search', anyRole, respond(() => passesService.search()))
passesRouter.post('/create', admin, respond((req) => passesService.create(parsePassInput(req.body)), HttpStatus.CREATED))
passesRouter.patch('/update/:id', admin, respond((req) => passesService.update(idOf(req), parsePassInput(req.body))))
passesRouter.patch('/deactivate/:id', admin, respond((req) => passesService.deactivate(idOf(req))))
passesRouter.patch('/activate/:id', admin, respond((req) => passesService.activate(idOf(req))))
passesRouter.delete('/delete/:id', admin, respond((req) => passesService.remove(idOf(req))))
