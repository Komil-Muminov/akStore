import { FiscalTransportKind } from '../model'

export interface ITransportOptions {
  host: string
  port: number
  path: string
  baudRate: number
  timeout: number
}

export interface IFiscalTransport {
  readonly kind: FiscalTransportKind
  readonly isOpen: boolean
  address: () => string
  open: () => Promise<void>
  close: () => Promise<void>
  request: (payload: Uint8Array) => Promise<Uint8Array>
}

export const TRANSPORT_CLOSED = 'Канал связи с регистратором закрыт'
export const TRANSPORT_TIMEOUT = 'Регистратор не ответил за отведённое время'
export const TRANSPORT_UNSUPPORTED = 'Для этого канала связи нужен драйвер конкретной модели ККМ'
