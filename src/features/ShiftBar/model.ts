import type { IShiftState } from '@/entities/sale'

export interface IProps {
  state: IShiftState | null
  cartTotal: number
  pending: boolean
  error?: string
  notice?: string
  onOpen: (openingCash: number) => void
  onClose: (closingCash: number, note: string) => void
  onPay: (cashPaid: number, cardPaid: number) => void
  lastSaleId: string | null
  onPrintReceipt: () => void
  parkedCount: number
  canPark: boolean
  onPark: () => void
  onOpenParked: () => void
}

export const CASH_FIELD_LABEL = 'Наличные'
export const CARD_FIELD_LABEL = 'Карта'
export const PAY_LABEL = 'Оплатить'
export const EXACT_TOOLTIP = 'Без сдачи'
export const PARK_LABEL = 'Отложить'
export const PARK_TOOLTIP = 'Отложить чек и обслужить следующего'
export const PARKED_TOOLTIP = 'Отложенные чеки'
export const RECEIPT_LABEL = 'Чек'
export const RECEIPT_TOOLTIP = 'Печать чека последней продажи'
export const CLOSED_TITLE = 'Смена закрыта'
export const CLOSED_HINT = 'Внесите наличные в кассу и откройте смену'
export const OPEN_LABEL = 'Открыть смену'
export const CLOSE_LABEL = 'Закрыть смену'
export const OPENING_LABEL = 'Наличные на начало'
export const SHIFT_LABEL = 'Смена'
export const REVENUE_LABEL = 'Выручка'
export const CASH_LABEL = 'Наличными'
export const CARD_LABEL = 'Картой'
export const EXPECTED_LABEL = 'Ожидается в кассе'
export const SALES_LABEL = 'Чеков'
export const PAID_LABEL = 'Получено'
export const CHANGE_LABEL = 'Сдача'
