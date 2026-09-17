import { config } from '../../config'
import { FiscalTransportKind } from '../model'
import { createSerialTransport } from './serial.transport'
import { createTcpTransport } from './tcp.transport'
import type { IFiscalTransport, ITransportOptions } from './model'

const optionsOf = (): ITransportOptions => ({
  host: config.fiscal.host,
  port: config.fiscal.port,
  path: config.fiscal.path,
  baudRate: config.fiscal.baudRate,
  timeout: config.fiscal.timeout,
})

export const createTransport = (kind: FiscalTransportKind): IFiscalTransport | null => {
  if (kind === FiscalTransportKind.TCP) return createTcpTransport(optionsOf())
  if (kind === FiscalTransportKind.SERIAL) return createSerialTransport(optionsOf())
  return null
}

export const transportKind = (): FiscalTransportKind => {
  const requested = config.fiscal.transport as FiscalTransportKind
  return Object.values(FiscalTransportKind).includes(requested) ? requested : FiscalTransportKind.NONE
}

export type { IFiscalTransport, ITransportOptions } from './model'
export { TRANSPORT_CLOSED, TRANSPORT_TIMEOUT, TRANSPORT_UNSUPPORTED } from './model'
