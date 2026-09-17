import type { IConversation, IMember, IMessage } from '@/entities/message'

export interface IProps {
  conversation: IConversation | null
  messages: IMessage[]
  members: IMember[]
  currentUserId: string
  loading: boolean
  typingName: string
  hasMore: boolean
  onLoadOlder: () => void
  onLeave: () => void
  onManage: () => void
  onEditMessage: (message: IMessage) => void
  onRemoveMessage: (message: IMessage) => void
  onDownload: (message: IMessage) => void
  onDropFiles: (paths: string[]) => void
  dropHint: boolean
}

export const ESTIMATED_MESSAGE_HEIGHT = 64
export const BUBBLE_WIDTH_RATIO = 0.72
export const PLACEHOLDER_TITLE = 'Выберите диалог'
export const PLACEHOLDER_HINT = 'Слева список переписок, а через поиск можно написать любому сотруднику'
export const THREAD_EMPTY_TITLE = 'Сообщений пока нет'
export const THREAD_EMPTY_HINT = 'Напишите первым — сообщение уйдёт мгновенно'
export const LOAD_OLDER_LABEL = 'Показать более ранние'
export const COMPANION_HINT = 'Личная переписка'
export const LEAVE_TOOLTIP = 'Покинуть группу'
export const MANAGE_TOOLTIP = 'Управление группой'
export const MEMBERS_SEPARATOR = ', '
