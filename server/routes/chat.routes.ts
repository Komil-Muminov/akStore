import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { chatService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole, type IAuthUser } from '../types'
import { parseCompanionId, parseMessageBody } from './chat.validation'
import { idOf, respond } from './respond'

const anyRole = rbacMiddleware(UserRole.EMPLOYEE)
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

export const chatRouter = Router()

chatRouter.get('/search', anyRole, respond((req) => chatService.search(actorOf(req))))
chatRouter.get('/history/:id', anyRole, respond((req) => chatService.history(actorOf(req), idOf(req))))
chatRouter.post('/open', anyRole, respond(
  (req) => chatService.openDirect(actorOf(req), parseCompanionId(req.body)),
  HttpStatus.CREATED,
))
chatRouter.post('/send/:id', anyRole, respond(
  (req) => chatService.send(actorOf(req), idOf(req), parseMessageBody(req.body)),
  HttpStatus.CREATED,
))
chatRouter.patch('/read/:id', anyRole, respond((req) => chatService.markRead(actorOf(req), idOf(req))))
