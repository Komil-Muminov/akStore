import type { IDebtorCard } from '@/entities/debt'

export interface IProps {
  open: boolean
  card: IDebtorCard | null
  pending: boolean
  error?: string
  onLend: (amount: number, note: string) => void
  onRepay: (amount: number, note: string) => void
  onClose: () => void
}

export const DESCRIPTION = 'История долга и погашений'
export const BALANCE_LABEL = 'Текущий долг'
export const AMOUNT_HINT = 'Сумма'
export const NOTE_HINT = 'Комментарий'
export const LEND_LABEL = 'В долг'
export const REPAY_LABEL = 'Погасить'
export const CLOSE_LABEL = 'Закрыть'
export const EMPTY_HINT = 'Движений пока нет'
export const ESTIMATED_ROW_HEIGHT = 52
