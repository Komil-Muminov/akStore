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

export interface ISocketData {
  userId: string
}

export interface IIncomingEvent {
  type: ChatEventType
  conversationId: string
}
