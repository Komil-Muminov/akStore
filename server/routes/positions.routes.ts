import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { positionsService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole } from '../types'
import { parsePositionInput } from './org.validation'
import { idOf, respond } from './respond'

const admin = rbacMiddleware(UserRole.ADMIN)
const anyRole = rbacMiddleware(UserRole.EMPLOYEE)

export const positionsRouter = Router()

positionsRouter.get('/search', anyRole, respond(() => positionsService.search()))
positionsRouter.post('/create', admin, respond((req) => positionsService.create(parsePositionInput(req.body)), HttpStatus.CREATED))
positionsRouter.patch('/update/:id', admin, respond((req) => positionsService.update(idOf(req), parsePositionInput(req.body))))
positionsRouter.delete('/delete/:id', admin, respond((req) => positionsService.remove(idOf(req))))
