import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { chatService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole, type IAuthUser } from '../types'
import { parseCompanionId, parseGroupInput, parseMemberList, parseMessageBody } from './chat.validation'
import { idOf, respond } from './respond'

const anyRole = rbacMiddleware(UserRole.EMPLOYEE)
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

export const chatRouter = Router()

chatRouter.get('/search', anyRole, respond((req) => chatService.search(actorOf(req))))
chatRouter.get('/unread-count', anyRole, respond((req) => chatService.unreadTotal(actorOf(req))))
chatRouter.get('/online', anyRole, respond((req) => chatService.online(actorOf(req))))
chatRouter.get('/history/:id', anyRole, respond((req) =>
  chatService.history(actorOf(req), idOf(req), typeof req.query.before === 'string' ? req.query.before : null),
))
chatRouter.get('/search-messages', anyRole, respond((req) =>
  chatService.searchMessages(actorOf(req), typeof req.query.q === 'string' ? req.query.q : ''),
))
chatRouter.get('/members/:id', anyRole, respond((req) => chatService.members(actorOf(req), idOf(req))))
chatRouter.post('/open', anyRole, respond(
  (req) => chatService.openDirect(actorOf(req), parseCompanionId(req.body)),
  HttpStatus.CREATED,
))
chatRouter.post('/create-group', anyRole, respond((req) => {
  const { title, memberIds } = parseGroupInput(req.body)
  return chatService.createGroup(actorOf(req), title, memberIds)
}, HttpStatus.CREATED))
chatRouter.post('/add-members/:id', anyRole, respond(
  (req) => chatService.addMembers(actorOf(req), idOf(req), parseMemberList(req.body)),
))
chatRouter.post('/send/:id', anyRole, respond(
  (req) => chatService.send(actorOf(req), idOf(req), parseMessageBody(req.body)),
  HttpStatus.CREATED,
))
chatRouter.patch('/leave/:id', anyRole, respond((req) => chatService.leave(actorOf(req), idOf(req))))
chatRouter.patch('/read/:id', anyRole, respond((req) => chatService.markRead(actorOf(req), idOf(req))))
