import type { IPosition, IPositionInput } from '@/entities/position'

export interface IProps {
  open: boolean
  positions: IPosition[]
  pending: boolean
  error?: string
  onCreate: (input: IPositionInput) => void
  onDelete: (position: IPosition) => void
  onClose: () => void
}

export const TITLE = 'Справочник должностей'
export const DESCRIPTION = 'Ранг задаёт порядок по старшинству: чем меньше число, тем выше должность.'
export const NAME_PLACEHOLDER = 'Название должности'
export const RANK_PLACEHOLDER = 'Ранг'
export const ADD_LABEL = 'Добавить'
export const CLOSE_LABEL = 'Закрыть'
export const DELETE_TOOLTIP = 'Удалить должность'
export const EMPTY = 'Должностей пока нет'
export const RANK_PREFIX = 'ранг '
