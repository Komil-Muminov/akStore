export interface IReportPeriod {
  from: string
  to: string
}

export interface IReportDay {
  date: string
  issued: number
  revoked: number
}

export interface IReportHost {
  hostName: string
  count: number
}

export interface IReportSummary extends IReportPeriod {
  issued: number
  active: number
  revoked: number
  uniqueHolders: number
  byDay: IReportDay[]
  topHosts: IReportHost[]
}

export enum ReportPreset {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  CUSTOM = 'custom',
}

export const PRESET_LABELS: Record<ReportPreset, string> = {
  [ReportPreset.TODAY]: 'Сегодня',
  [ReportPreset.WEEK]: '7 дней',
  [ReportPreset.MONTH]: '30 дней',
  [ReportPreset.QUARTER]: '90 дней',
  [ReportPreset.CUSTOM]: 'Период',
}

export const PRESET_DAYS: Record<ReportPreset, number> = {
  [ReportPreset.TODAY]: 0,
  [ReportPreset.WEEK]: 6,
  [ReportPreset.MONTH]: 29,
  [ReportPreset.QUARTER]: 89,
  [ReportPreset.CUSTOM]: 0,
}
