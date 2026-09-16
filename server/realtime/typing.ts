import { chatMembersDb } from '../db/chat.members.db'
import { usersDb } from '../db/users.db'
import { hub } from './hub'
import { ChatEventType } from './model'

export const handleTyping = async (userId: string, conversationId: string) => {
  const members = await chatMembersDb.ids(conversationId)
  if (!members.includes(userId)) return
  const author = await usersDb.find(userId)
  const audience = members.filter((id) => id !== userId)
  hub.publish(audience, ChatEventType.TYPING, {
    conversationId,
    userId,
    userName: author?.fullName ?? '',
  })
}
