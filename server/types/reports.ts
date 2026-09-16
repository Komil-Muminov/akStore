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
