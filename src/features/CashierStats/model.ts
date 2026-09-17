import type { ICashierStat } from '@/entities/report'

export interface IProps {
  cashiers: ICashierStat[]
}

export const TITLE = 'По кассирам'
export const EMPTY_HINT = 'Продаж за период нет'
export const RECEIPTS_LABEL = 'чеков'
export const PROFIT_LABEL = 'прибыль'
export const REFUND_LABEL = 'возвраты'
