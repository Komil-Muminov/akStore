import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { chatService } from '../services'
import { decodeFileName, uploader, uploadsPathOf } from '../shared/uploads'
import { HttpError, HttpStatus } from '../shared/utils'
import { UserRole, type IAuthUser } from '../types'
import {
  parseCompanionId,
  parseGroupInput,
  parseMemberId,
  parseMemberList,
  parseMessageBody,
  parseTitle,
} from './chat.validation'
import { idOf, respond } from './respond'

const anyRole = rbacMiddleware(UserRole.EMPLOYEE)
const FILE_FIELD = 'file'
const FILE_REQUIRED = 'Файл не передан'
const actorOf = (req: { user?: IAuthUser }) => (req.user as IAuthUser).id

export const chatRouter = Router()

chatRouter.get('/search', anyRole, respond((req) => chatService.search(actorOf(req))))
chatRouter.get('/unread-count', anyRole, respond((req) => chatService.unreadTotal(actorOf(req))))
chatRouter.get('/colleagues', anyRole, respond((req) => chatService.colleagues(actorOf(req))))
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
chatRouter.patch('/edit-message/:id', anyRole, respond(
  (req) => chatService.editMessage(actorOf(req), idOf(req), parseMessageBody(req.body)),
))
chatRouter.delete('/delete-message/:id', anyRole, respond((req) =>
  chatService.removeMessage(actorOf(req), idOf(req)),
))
chatRouter.patch('/rename/:id', anyRole, respond(
  (req) => chatService.rename(actorOf(req), idOf(req), parseTitle(req.body)),
))
chatRouter.post('/remove-member/:id', anyRole, respond(
  (req) => chatService.removeMember(actorOf(req), idOf(req), parseMemberId(req.body)),
))
chatRouter.patch('/leave/:id', anyRole, respond((req) => chatService.leave(actorOf(req), idOf(req))))
chatRouter.patch('/read/:id', anyRole, respond((req) => chatService.markRead(actorOf(req), idOf(req))))

chatRouter.post('/upload/:id', anyRole, uploader.single(FILE_FIELD), respond((req) => {
  const file = req.file
  if (!file) throw new HttpError(HttpStatus.BAD_REQUEST, FILE_REQUIRED)
  const attachment = {
    fileName: decodeFileName(file.originalname),
    filePath: file.filename,
    fileSize: file.size,
    fileMime: file.mimetype,
  }
  const caption = typeof req.body?.body === 'string' ? req.body.body.trim() : ''
  return chatService.send(actorOf(req), idOf(req), caption, attachment)
}, HttpStatus.CREATED))

chatRouter.get('/file/:id', anyRole, async (req, res, next) => {
  try {
    const stored = await chatService.fileOf(actorOf(req), idOf(req))
    res.download(uploadsPathOf(stored.path), stored.name)
  } catch (error) {
    next(error)
  }
})
