export interface IConversation {
  id: string
  companionId: string
  companionName: string
  companionLogin: string
  lastMessage: string
  lastMessageAt: string | null
  unreadCount: number
}

export interface IMessage {
  id: string
  conversationId: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
}

export const EMPTY_PREVIEW = 'Нет сообщений'
export const UNREAD_LIMIT = 99
export const UNREAD_OVERFLOW = '99+'
