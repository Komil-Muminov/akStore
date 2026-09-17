import type { IDailyPoint } from '@/entities/report'

export interface IProps {
  points: IDailyPoint[]
}

export const TITLE = 'Выручка по дням'
export const EMPTY_HINT = 'За выбранный период продаж не было'
export const PROFIT_HINT = 'прибыль'
