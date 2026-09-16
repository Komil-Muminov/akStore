import { chatDb, chatMembersDb, chatMessagesDb, usersDb } from '../db'
import { hub } from '../realtime/hub'
import { ChatEventType } from '../realtime/model'
import { HttpError, HttpStatus } from '../shared/utils'
import { removeUpload } from '../shared/uploads'
import { ConversationKind, type IAttachment } from '../types'

const HISTORY_LIMIT = 50
const SEARCH_LIMIT = 40
const SEARCH_MIN = 2
const SEARCH_ERROR = `Запрос должен быть не короче ${SEARCH_MIN} символов`
const KEY_SEPARATOR = ':'
const GROUP_MIN_MEMBERS = 2
const SELF_CHAT_ERROR = 'Нельзя начать диалог с самим собой'
const COMPANION_MISSING = 'Сотрудник не найден'
const NOT_A_MEMBER = 'Диалог недоступен'
const GROUP_TOO_SMALL = 'В группе нужно минимум два участника'
const GROUP_ONLY = 'Действие доступно только в группах'
const MESSAGE_MISSING = 'Сообщение не найдено'
const NOT_AUTHOR = 'Можно менять только свои сообщения'
const NOT_OWNER = 'Управлять группой может только её создатель'
const SELF_REMOVE = 'Себя исключить нельзя, выйдите из группы'

const directKeyOf = (first: string, second: string) => [first, second].sort().join(KEY_SEPARATOR)

const requireMembership = async (conversationId: string, userId: string) => {
  const members = await chatMembersDb.ids(conversationId)
  if (!members.includes(userId)) throw new HttpError(HttpStatus.FORBIDDEN, NOT_A_MEMBER)
  return members
}

const requireGroup = async (conversationId: string, userId: string) => {
  const conversation = await chatDb.find(userId, conversationId)
  if (!conversation) throw new HttpError(HttpStatus.FORBIDDEN, NOT_A_MEMBER)
  if (conversation.kind !== ConversationKind.GROUP) throw new HttpError(HttpStatus.BAD_REQUEST, GROUP_ONLY)
  return conversation
}

const requireActiveUsers = async (userIds: string[]) => {
  const unique = [...new Set(userIds)]
  for (const userId of unique) {
    const user = await usersDb.find(userId)
    if (!user || !user.isActive) throw new HttpError(HttpStatus.NOT_FOUND, COMPANION_MISSING)
  }
  return unique
}

const loaded = async (userId: string, conversationId: string) => {
  const conversation = await chatDb.find(userId, conversationId)
  if (!conversation) throw new HttpError(HttpStatus.NOT_FOUND, NOT_A_MEMBER)
  return conversation
}

export const chatService = {
  search: async (userId: string) => chatDb.search(userId),

  openDirect: async (userId: string, companionId: string) => {
    if (userId === companionId) throw new HttpError(HttpStatus.BAD_REQUEST, SELF_CHAT_ERROR)
    await requireActiveUsers([companionId])
    const conversationId = await chatDb.ensureDirect(directKeyOf(userId, companionId))
    await chatMembersDb.add(conversationId, [userId, companionId])
    return loaded(userId, conversationId)
  },

  createGroup: async (userId: string, title: string, memberIds: string[]) => {
    const others = (await requireActiveUsers(memberIds)).filter((id) => id !== userId)
    if (others.length < GROUP_MIN_MEMBERS) throw new HttpError(HttpStatus.BAD_REQUEST, GROUP_TOO_SMALL)
    const conversationId = await chatDb.createGroup(title, userId)
    await chatMembersDb.add(conversationId, [userId, ...others])
    return loaded(userId, conversationId)
  },

  rename: async (userId: string, conversationId: string, title: string) => {
    await requireMembership(conversationId, userId)
    const conversation = await requireGroup(conversationId, userId)
    if (conversation.createdBy !== userId) throw new HttpError(HttpStatus.FORBIDDEN, NOT_OWNER)
    await chatDb.rename(conversationId, title)
    return loaded(userId, conversationId)
  },

  removeMember: async (userId: string, conversationId: string, memberId: string) => {
    if (userId === memberId) throw new HttpError(HttpStatus.BAD_REQUEST, SELF_REMOVE)
    await requireMembership(conversationId, userId)
    const conversation = await requireGroup(conversationId, userId)
    if (conversation.createdBy !== userId) throw new HttpError(HttpStatus.FORBIDDEN, NOT_OWNER)
    await chatMembersDb.remove(conversationId, memberId)
    return chatMembersDb.list(conversationId)
  },

  members: async (userId: string, conversationId: string) => {
    await requireMembership(conversationId, userId)
    return chatMembersDb.list(conversationId)
  },

  addMembers: async (userId: string, conversationId: string, memberIds: string[]) => {
    await requireMembership(conversationId, userId)
    await requireGroup(conversationId, userId)
    const added = await requireActiveUsers(memberIds)
    await chatMembersDb.add(conversationId, added)
    return chatMembersDb.list(conversationId)
  },

  leave: async (userId: string, conversationId: string) => {
    await requireMembership(conversationId, userId)
    await requireGroup(conversationId, userId)
    await chatMembersDb.remove(conversationId, userId)
    if ((await chatMembersDb.count(conversationId)) === 0) await chatMembersDb.dropEmpty(conversationId)
    return { ok: true as const }
  },

  history: async (userId: string, conversationId: string, before: string | null) => {
    await requireMembership(conversationId, userId)
    if (before === null) await chatDb.markRead(conversationId, userId)
    const items = await chatMessagesDb.history(conversationId, HISTORY_LIMIT, before)
    const oldest = items[0]?.createdAt ?? null
    const hasMore = oldest === null ? false : (await chatMessagesDb.countOlder(conversationId, oldest)) > 0
    return { items, hasMore }
  },

  searchMessages: async (userId: string, query: string) => {
    const needle = query.trim()
    if (needle.length < SEARCH_MIN) throw new HttpError(HttpStatus.BAD_REQUEST, SEARCH_ERROR)
    return chatMessagesDb.search(userId, `%${needle}%`, SEARCH_LIMIT)
  },

  send: async (userId: string, conversationId: string, body: string, file: IAttachment | null = null) => {
    const members = await requireMembership(conversationId, userId)
    const message = await chatMessagesDb.create(conversationId, userId, body, file)
    await chatDb.markRead(conversationId, userId)
    hub.publish(members, ChatEventType.MESSAGE, message)
    return message
  },

  editMessage: async (userId: string, messageId: string, body: string) => {
    const existing = await chatMessagesDb.find(messageId)
    if (!existing || existing.isDeleted) throw new HttpError(HttpStatus.NOT_FOUND, MESSAGE_MISSING)
    if (existing.authorId !== userId) throw new HttpError(HttpStatus.FORBIDDEN, NOT_AUTHOR)
    const members = await requireMembership(existing.conversationId, userId)
    const updated = await chatMessagesDb.update(messageId, body)
    if (!updated) throw new HttpError(HttpStatus.NOT_FOUND, MESSAGE_MISSING)
    hub.publish(members, ChatEventType.MESSAGE_UPDATED, updated)
    return updated
  },

  fileOf: async (userId: string, messageId: string) => {
    const existing = await chatMessagesDb.find(messageId)
    if (!existing || existing.isDeleted || existing.fileName.length === 0) {
      throw new HttpError(HttpStatus.NOT_FOUND, MESSAGE_MISSING)
    }
    await requireMembership(existing.conversationId, userId)
    const stored = await chatMessagesDb.filePathOf(messageId)
    if (!stored) throw new HttpError(HttpStatus.NOT_FOUND, MESSAGE_MISSING)
    return stored
  },

  removeMessage: async (userId: string, messageId: string) => {
    const existing = await chatMessagesDb.find(messageId)
    if (!existing || existing.isDeleted) throw new HttpError(HttpStatus.NOT_FOUND, MESSAGE_MISSING)
    if (existing.authorId !== userId) throw new HttpError(HttpStatus.FORBIDDEN, NOT_AUTHOR)
    const members = await requireMembership(existing.conversationId, userId)
    const stored = await chatMessagesDb.filePathOf(messageId)
    const removed = await chatMessagesDb.softDelete(messageId)
    if (!removed) throw new HttpError(HttpStatus.NOT_FOUND, MESSAGE_MISSING)
    if (stored?.path) removeUpload(stored.path)
    hub.publish(members, ChatEventType.MESSAGE_REMOVED, removed)
    return removed
  },

  markRead: async (userId: string, conversationId: string) => {
    const members = await requireMembership(conversationId, userId)
    await chatDb.markRead(conversationId, userId)
    const audience = members.filter((id) => id !== userId)
    hub.publish(audience, ChatEventType.READ, { conversationId, userId, at: new Date().toISOString() })
    return { ok: true as const }
  },

  unreadTotal: async (userId: string) => ({ total: await chatDb.unreadTotal(userId) }),

  online: async (userId: string) => hub.online().filter((id) => id !== userId),
}
