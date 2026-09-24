import type { IDailyPoint, IHourlyPoint } from '@/entities/report'

export type TChartMode = 'daily' | 'hourly'

export interface IProps {
  points: IDailyPoint[]
  hourlyPoints?: IHourlyPoint[]
}

export const TITLE = 'Динамика продаж'
export const DAILY_TITLE = 'Выручка по дням'
export const HOURLY_TITLE = 'Пиковые часы (нагрузка кассы)'
export const DAILY_TAB = 'По дням'
export const HOURLY_TAB = 'По часам'
export const EMPTY_HINT = 'За выбранный период продаж не было'
export const PROFIT_HINT = 'прибыль'
export const CHECKS_LABEL = 'чеков'
export const PEAK_LABEL = 'Пиковый час'
