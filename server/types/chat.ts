export enum ConversationKind {
  DIRECT = 'direct',
  GROUP = 'group',
}

export interface IConversation {
  id: string
  kind: ConversationKind
  title: string
  companionId: string
  companionName: string
  companionLogin: string
  companionReadAt: string | null
  membersCount: number
  lastMessage: string
  lastMessageAuthor: string
  lastMessageAt: string | null
  unreadCount: number
}

export interface IConversationRow {
  id: string
  kind: ConversationKind
  title: string
  companion_id: string | null
  companion_name: string | null
  companion_login: string | null
  companion_read_at: Date | null
  members_count: string
  last_message: string | null
  last_message_author: string | null
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

export interface IMember {
  userId: string
  fullName: string
  login: string
}

export interface IMemberRow {
  user_id: string
  full_name: string
  login: string
}

export interface IGroupInput {
  title: string
  memberIds: string[]
}
