import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { usersService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole, type IAuthUser } from '../types'
import { parsePassword, parseUserInput, parseUserUpdate } from './auth.validation'
import { idOf, respond } from './respond'

const admin = rbacMiddleware(UserRole.ADMIN)
const actorOf = (req: { user?: IAuthUser }) => req.user as IAuthUser

export const usersRouter = Router()

usersRouter.get('/search', admin, respond((req) => usersService.search(actorOf(req))))
usersRouter.post('/create', admin, respond((req) => usersService.create(actorOf(req), parseUserInput(req.body)), HttpStatus.CREATED))
usersRouter.patch('/update/:id', admin, respond((req) => {
  const { fullName, isActive } = parseUserUpdate(req.body)
  return usersService.update(actorOf(req), idOf(req), fullName, isActive)
}))
usersRouter.patch('/reset-password/:id', admin, respond((req) =>
  usersService.resetPassword(actorOf(req), idOf(req), parsePassword((req.body as { password?: unknown })?.password)),
))
usersRouter.delete('/delete/:id', admin, respond((req) => usersService.remove(actorOf(req), idOf(req))))
