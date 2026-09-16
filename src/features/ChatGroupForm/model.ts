import type { IHost } from '@/entities/host'

export interface IGroupSubmit {
  title: string
  memberIds: string[]
}

export interface IProps {
  open: boolean
  companions: IHost[]
  pending: boolean
  error?: string
  onSubmit: (values: IGroupSubmit) => void
  onClose: () => void
}

export const MIN_MEMBERS = 2
export const MODAL_TITLE = 'Новая группа'
export const MODAL_DESCRIPTION = 'Название и участники переписки'
export const TITLE_LABEL = 'Название группы'
export const TITLE_PLACEHOLDER = 'Например, Отдел режима'
export const SEARCH_PLACEHOLDER = 'Поиск сотрудника'
export const MEMBERS_LABEL = 'Участники'
export const SUBMIT_LABEL = 'Создать группу'
export const CANCEL_LABEL = 'Отмена'
export const EMPTY_RESULT = 'Никого не нашли'
export const HINT = 'Отметьте минимум двух коллег'
export const ESTIMATED_ITEM_HEIGHT = 44
