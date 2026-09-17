import { FiscalMode, type IFiscalDriver } from './model'

export const disabledDriver: IFiscalDriver = {
  mode: FiscalMode.DISABLED,
  enabled: false,
  register: async () => null,
}
