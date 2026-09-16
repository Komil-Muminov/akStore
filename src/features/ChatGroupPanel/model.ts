import type { IHost } from '@/entities/host'
import type { IMember } from '@/entities/message'

export interface IProps {
  open: boolean
  title: string
  members: IMember[]
  companions: IHost[]
  isOwner: boolean
  pending: boolean
  error?: string
  onRename: (title: string) => void
  onAddMembers: (memberIds: string[]) => void
  onRemoveMember: (memberId: string) => void
  onClose: () => void
}

export const PANEL_TITLE = 'Управление группой'
export const PANEL_DESCRIPTION = 'Название, состав и приглашения'
export const TITLE_LABEL = 'Название группы'
export const RENAME_LABEL = 'Переименовать'
export const MEMBERS_LABEL = 'Состав'
export const ADD_LABEL = 'Добавить выбранных'
export const ADD_SECTION = 'Кого пригласить'
export const SEARCH_PLACEHOLDER = 'Поиск сотрудника'
export const REMOVE_TOOLTIP = 'Исключить из группы'
export const OWNER_MARK = 'создатель'
export const READONLY_HINT = 'Менять состав может только создатель группы'
export const EMPTY_CANDIDATES = 'Все сотрудники уже в группе'
export const ESTIMATED_ITEM_HEIGHT = 44
