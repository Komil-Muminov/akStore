import type { ISale } from '../types'

export enum FiscalMode {
  DISABLED = 'disabled',
}

export interface IFiscalRegistration {
  number: string
  sign: string
  device: string
}

export interface IFiscalDriver {
  readonly mode: FiscalMode
  readonly enabled: boolean
  register: (sale: ISale) => Promise<IFiscalRegistration | null>
}

export const FISCAL_UNAVAILABLE = 'Фискальный регистратор не подключён'
