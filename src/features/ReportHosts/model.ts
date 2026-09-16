import type { IReportHost } from '@/entities/report'

export interface IProps {
  hosts: IReportHost[]
}

export const TITLE = 'К кому чаще всего'
export const EMPTY = 'Нет данных за период'
export const COUNT_SUFFIX = ' проп.'
