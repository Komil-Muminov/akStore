import type { IReportPeriod, ReportPreset } from '@/entities/report'

export interface IProps {
  preset: ReportPreset
  period: IReportPeriod
  onPreset: (preset: ReportPreset) => void
  onPeriod: (period: IReportPeriod) => void
}

export const FROM_LABEL = 'С'
export const TO_LABEL = 'По'
export const DATE_PLACEHOLDER = 'дд.мм.гггг'
export const APPLY_LABEL = 'Показать'
export const DATE_ERROR = 'Введите дату в формате дд.мм.гггг'
export const ORDER_ERROR = 'Дата «по» раньше даты «с»'
