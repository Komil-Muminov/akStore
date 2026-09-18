import type { ICashMove } from '@/entities/debt'

export interface IProps {
  open: boolean
  moves: ICashMove[]
  pending: boolean
  error?: string
  onMove: (kind: string, amount: number, note: string) => void
  onClose: () => void
}

export const TITLE = 'Наличные в кассе'
export const DESCRIPTION = 'Размен утром, инкассация вечером'
export const AMOUNT_HINT = 'Сумма'
export const NOTE_HINT = 'Комментарий'
export const IN_LABEL = 'Внести'
export const OUT_LABEL = 'Изъять'
export const CLOSE_LABEL = 'Закрыть'
export const EMPTY_HINT = 'Движений за смену не было'
export const ESTIMATED_ROW_HEIGHT = 52
