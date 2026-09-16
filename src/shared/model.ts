export interface IApiResponse<T> {
  data: T
}

export interface IPagedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IApiError {
  message: string
}

export type THttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface ISessionUser {
  id: string
  login: string
  role: string
  fullName: string
}

export interface ISession {
  token: string
  user: ISessionUser
}

export enum ChatEventType {
  MESSAGE = 'message',
  MESSAGE_UPDATED = 'message-updated',
  MESSAGE_REMOVED = 'message-removed',
  PRESENCE = 'presence',
  TYPING = 'typing',
  READ = 'read',
  CONVERSATION = 'conversation',
}

export interface IChatEvent {
  type: ChatEventType
  payload: unknown
}

export interface IPresencePayload {
  userId: string
  online: boolean
}

export interface ITypingPayload {
  conversationId: string
  userId: string
  userName: string
}

export interface IReadPayload {
  conversationId: string
  userId: string
  at: string
}
