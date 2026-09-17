export enum ConversationKind {
  DIRECT = 'direct',
  GROUP = 'group',
}

export interface IConversation {
  id: string
  kind: ConversationKind
  title: string
  createdBy: string
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

export interface IMessage {
  id: string
  conversationId: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
  editedAt: string | null
  isDeleted: boolean
  fileName: string
  fileSize: number
  fileMime: string
}

export interface IMember {
  userId: string
  fullName: string
  login: string
}

export interface IColleague {
  userId: string
  fullName: string
  login: string
  positionName: string
}

export const UNREAD_LIMIT = 99
export const UNREAD_OVERFLOW = '99+'
export const DIRECT_HINT = 'Личная переписка'
export const ONLINE_HINT = 'В сети'
export const OFFLINE_HINT = 'Не в сети'
export const TYPING_HINT = 'печатает…'
export const EDITED_MARK = 'изменено'
export const DELETED_BODY = 'Сообщение удалено'
export const SIZE_UNITS = ['Б', 'КБ', 'МБ', 'ГБ']
export const UPLOAD_HINT = 'Отправляю файл…'
export const FILE_PREVIEW = 'Файл'
export const MEMBERS_FORMS = ['участник', 'участника', 'участников']
