import { config } from '../config'
import { disabledDriver } from './disabled.driver'
import { FiscalMode, type IFiscalDriver } from './model'

const DRIVERS: Record<FiscalMode, IFiscalDriver> = {
  [FiscalMode.DISABLED]: disabledDriver,
}

const resolve = (): IFiscalDriver => {
  const requested = config.fiscalMode as FiscalMode
  return DRIVERS[requested] ?? disabledDriver
}

export const fiscalDriver = resolve()

export { FiscalMode } from './model'
export type { IFiscalDriver, IFiscalRegistration } from './model'
