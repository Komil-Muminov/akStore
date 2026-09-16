import type { IConversation, IMessage } from '@/entities/message'

export interface IProps {
  conversation: IConversation | null
  messages: IMessage[]
  currentUserId: string
  loading: boolean
}

export const ESTIMATED_MESSAGE_HEIGHT = 64
export const PLACEHOLDER_TITLE = 'Выберите диалог'
export const PLACEHOLDER_HINT = 'Слева список переписок, а через поиск можно написать любому сотруднику'
export const THREAD_EMPTY_TITLE = 'Сообщений пока нет'
export const THREAD_EMPTY_HINT = 'Напишите первым — сообщение уйдёт мгновенно'
export const COMPANION_HINT = 'Личная переписка'
