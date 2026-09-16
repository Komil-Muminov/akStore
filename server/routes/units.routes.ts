import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { unitsService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole } from '../types'
import { parseLayout, parseParentId, parseUnitAssignments, parseUnitInput, parseUnitUpdate } from './org.validation'
import { idOf, respond } from './respond'

const admin = rbacMiddleware(UserRole.ADMIN)
const anyRole = rbacMiddleware(UserRole.EMPLOYEE)

export const unitsRouter = Router()

unitsRouter.get('/search', anyRole, respond(() => unitsService.search()))
unitsRouter.post('/create', admin, respond((req) => unitsService.create(parseUnitInput(req.body)), HttpStatus.CREATED))
unitsRouter.patch('/update/:id', admin, respond((req) => {
  const { name, x, y } = parseUnitUpdate(req.body)
  return unitsService.update(idOf(req), name, x, y)
}))
unitsRouter.patch('/move/:id', admin, respond((req) => unitsService.move(idOf(req), parseParentId(req.body))))
unitsRouter.patch('/set-layout', admin, respond((req) => unitsService.setLayout(parseLayout(req.body))))
unitsRouter.patch('/set-positions/:id', admin, respond((req) => unitsService.setPositions(idOf(req), parseUnitAssignments(req.body))))
unitsRouter.delete('/delete/:id', admin, respond((req) => unitsService.remove(idOf(req))))
