import { FiscalMode, type IFiscalDriver } from '../model'

const DEVICE = ''

export const disabledDriver: IFiscalDriver = {
  mode: FiscalMode.DISABLED,
  enabled: false,
  connect: async () => undefined,
  disconnect: async () => undefined,
  probe: async () => false,
  device: () => DEVICE,
  register: async () => null,
  openShift: async () => undefined,
  closeShift: async () => null,
}
