import type { IReportDay } from '@/entities/report'

export interface IProps {
  days: IReportDay[]
}

export const TITLE = 'Выдано по дням'
export const EMPTY = 'За выбранный период пропуска не выдавались'
export const MAX_BARS = 92
export const MAX_LABELS = 8
export const TOOLTIP_ISSUED = 'выдано'
export const TOOLTIP_REVOKED = 'отозвано'
