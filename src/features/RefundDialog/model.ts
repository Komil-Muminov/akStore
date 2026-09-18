import type { ISale } from '@/entities/sale'

export interface IRefundLine {
  itemId: string
  quantity: number
}

export interface IProps {
  sale: ISale | null
  picked: Record<string, number>
  pending: boolean
  error?: string
  onPick: (itemId: string, quantity: number) => void
  onSubmit: () => void
  onClose: () => void
}

export const TITLE = 'Возврат по чеку'
export const DESCRIPTION = 'Отметьте, что именно возвращает покупатель'
export const REFUNDED_LABEL = 'уже вернули'
export const AVAILABLE_LABEL = 'можно вернуть'
export const TOTAL_LABEL = 'К возврату'
export const SUBMIT_LABEL = 'Оформить возврат'
export const CANCEL_LABEL = 'Отмена'
export const ALL_LABEL = 'Всё'
export const ESTIMATED_ROW_HEIGHT = 56
