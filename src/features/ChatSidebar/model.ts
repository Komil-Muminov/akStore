import type { IConversation } from '@/entities/message'
import type { IHost } from '@/entities/host'

export interface IProps {
  conversations: IConversation[]
  companions: IHost[]
  online: string[]
  query: string
  activeId: string | null
  onQueryChange: (value: string) => void
  onSelect: (conversationId: string) => void
  onOpenCompanion: (companionId: string) => void
  onCreateGroup: () => void
}

export const SIDEBAR_TITLE = 'Сообщения'
export const CREATE_GROUP_TOOLTIP = 'Создать группу'
export const SEARCH_PLACEHOLDER = 'Поиск по сотрудникам'
export const EMPTY_TITLE = 'Диалогов пока нет'
export const EMPTY_HINT = 'Найдите сотрудника через поиск, чтобы начать переписку'
export const NOT_FOUND_TITLE = 'Никого не нашли'
export const NOT_FOUND_HINT = 'Проверьте написание фамилии или логина'
export const COMPANIONS_SECTION = 'СОТРУДНИКИ'
export const DIALOGS_SECTION = 'ДИАЛОГИ'
