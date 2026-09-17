import type { IFiscalStatus } from '@/entities/sale'

export interface IProps {
  status: IFiscalStatus | null
}

export const DEVICE_LABEL = 'Аппарат'
export const QUEUE_LABEL = 'В очереди'
export const UNKNOWN_DEVICE = 'не указан'
