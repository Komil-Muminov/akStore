export interface IConversation {
  id: string
  companionId: string
  companionName: string
  companionLogin: string
  lastMessage: string
  lastMessageAt: string | null
  unreadCount: number
}

export interface IConversationRow {
  id: string
  companion_id: string
  companion_name: string
  companion_login: string
  last_message: string | null
  last_message_at: Date | null
  unread_count: string
}

export interface IMessage {
  id: string
  conversationId: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
}

export interface IMessageRow {
  id: string
  conversation_id: string
  author_id: string
  author_name: string
  body: string
  created_at: Date
}

export interface IMessageInput {
  conversationId: string
  body: string
}

export interface IChatEvent {
  message: IMessage
  recipients: string[]
}
