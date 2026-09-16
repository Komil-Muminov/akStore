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
  membersCount: number
  lastMessage: string
  lastMessageAuthor: string
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

export interface IMember {
  userId: string
  fullName: string
  login: string
}

export const UNREAD_LIMIT = 99
export const UNREAD_OVERFLOW = '99+'
export const DIRECT_HINT = 'Личная переписка'
export const MEMBERS_FORMS = ['участник', 'участника', 'участников']
