import type { IParkedSale } from '@/entities/sale'

export interface IProps {
  open: boolean
  parked: IParkedSale[]
  pending: boolean
  error?: string
  onRestore: (id: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}

export const TITLE = 'Отложенные чеки'
export const DESCRIPTION = 'Вернитесь к отложенной покупке или удалите её'
export const EMPTY_TITLE = 'Отложенных чеков нет'
export const EMPTY_HINT = 'Кнопка «Отложить» на кассе сохранит текущий чек'
export const RESTORE_TOOLTIP = 'Вернуть в кассу'
export const REMOVE_TOOLTIP = 'Удалить'
export const CLOSE_LABEL = 'Закрыть'
export const POSITIONS_LABEL = 'поз.'
export const ESTIMATED_ROW_HEIGHT = 64
