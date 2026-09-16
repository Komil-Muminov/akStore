import { chatDb, chatMessagesDb, usersDb } from '../db'
import { hub } from '../realtime'
import { HttpError, HttpStatus } from '../shared/utils'

const HISTORY_LIMIT = 200
const KEY_SEPARATOR = ':'
const SELF_CHAT_ERROR = 'Нельзя начать диалог с самим собой'
const COMPANION_MISSING = 'Сотрудник не найден'
const NOT_A_MEMBER = 'Диалог недоступен'

const directKeyOf = (first: string, second: string) =>
  [first, second].sort().join(KEY_SEPARATOR)

const requireMembership = async (conversationId: string, userId: string) => {
  const members = await chatDb.participants(conversationId)
  if (!members.includes(userId)) throw new HttpError(HttpStatus.FORBIDDEN, NOT_A_MEMBER)
  return members
}

export const chatService = {
  search: async (userId: string) => chatDb.search(userId),

  openDirect: async (userId: string, companionId: string) => {
    if (userId === companionId) throw new HttpError(HttpStatus.BAD_REQUEST, SELF_CHAT_ERROR)
    const companion = await usersDb.find(companionId)
    if (!companion || !companion.isActive) throw new HttpError(HttpStatus.NOT_FOUND, COMPANION_MISSING)
    const conversationId = await chatDb.ensure(directKeyOf(userId, companionId), [userId, companionId])
    const conversation = await chatDb.find(userId, conversationId)
    if (!conversation) throw new HttpError(HttpStatus.NOT_FOUND, COMPANION_MISSING)
    return conversation
  },

  history: async (userId: string, conversationId: string) => {
    await requireMembership(conversationId, userId)
    await chatDb.markRead(conversationId, userId)
    return chatMessagesDb.history(conversationId, HISTORY_LIMIT)
  },

  send: async (userId: string, conversationId: string, body: string) => {
    const members = await requireMembership(conversationId, userId)
    const message = await chatMessagesDb.create(conversationId, userId, body)
    await chatDb.markRead(conversationId, userId)
    hub.publish(members, message)
    return message
  },

  markRead: async (userId: string, conversationId: string) => {
    await requireMembership(conversationId, userId)
    await chatDb.markRead(conversationId, userId)
    return { ok: true as const }
  },
}
