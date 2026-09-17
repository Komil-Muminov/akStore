import { FiscalTransportKind } from '../model'
import { TRANSPORT_UNSUPPORTED, type IFiscalTransport, type ITransportOptions } from './model'

export const createSerialTransport = (options: ITransportOptions): IFiscalTransport => ({
  kind: FiscalTransportKind.SERIAL,
  isOpen: false,
  address: () => `${options.path}@${options.baudRate}`,
  open: async () => {
    throw new Error(TRANSPORT_UNSUPPORTED)
  },
  close: async () => undefined,
  request: async () => {
    throw new Error(TRANSPORT_UNSUPPORTED)
  },
})
