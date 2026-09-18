import type { IDebtor } from '@/entities/debt'

export interface IProps {
  debtors: IDebtor[]
  onOpen: (debtor: IDebtor) => void
  onEdit: (debtor: IDebtor) => void
  onArchive: (debtor: IDebtor) => void
}

export const EMPTY_TITLE = 'Должников нет'
export const EMPTY_HINT = 'Добавьте покупателя, который берёт под запись'
export const OPEN_TOOLTIP = 'История долга'
export const EDIT_TOOLTIP = 'Изменить'
export const ARCHIVE_TOOLTIP = 'Убрать из списка'
export const NO_DEBT_LABEL = 'нет долга'
export const ESTIMATED_ROW_HEIGHT = 64
