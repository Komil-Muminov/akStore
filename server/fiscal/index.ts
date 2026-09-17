import { config } from '../config'
import { disabledDriver } from './drivers/disabled.driver'
import { emulatorDriver } from './drivers/emulator.driver'
import { FiscalMode, type IFiscalDriver } from './model'
import { transportKind } from './transport'

const DRIVERS: Record<FiscalMode, IFiscalDriver> = {
  [FiscalMode.DISABLED]: disabledDriver,
  [FiscalMode.EMULATOR]: emulatorDriver,
}

const resolve = (): IFiscalDriver => {
  const requested = config.fiscal.mode as FiscalMode
  return DRIVERS[requested] ?? disabledDriver
}

export const fiscalDriver = resolve()

export const fiscalTransportKind = transportKind()

export { documentOf, qrOf, vatAmountOf } from './document'
export { startFiscalQueue, stopFiscalQueue } from './queue'
export { FiscalDocumentKind, FiscalMode, FiscalTransportKind } from './model'
export { FISCAL_NOT_CONFIGURED, FISCAL_QUEUED, FISCAL_UNAVAILABLE } from './model'
export type { IFiscalDocument, IFiscalDriver, IFiscalReport, IFiscalStatus } from './model'
