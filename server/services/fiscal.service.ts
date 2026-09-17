import { config } from '../config'
import { fiscalDb, salesDb } from '../db'
import { documentOf, fiscalDriver, fiscalTransportKind, FiscalDocumentKind } from '../fiscal'
import type { ISale } from '../types'

const OFFLINE = 'Регистратор недоступен, чеки уходят в очередь'
const ONLINE = 'Регистратор на связи'
const OFF = 'Фискализация выключена'
const REJECTED = 'Регистратор отклонил чек'

const queue = async (sale: ISale, kind: FiscalDocumentKind, reason: string) => {
  await fiscalDb.enqueue(sale.id, kind, reason)
  return sale
}

const apply = async (sale: ISale, kind: FiscalDocumentKind) => {
  if (!fiscalDriver.enabled) return sale
  try {
    const stamp = await fiscalDriver.register(documentOf(sale, kind))
    if (!stamp) return queue(sale, kind, REJECTED)
    await salesDb.attachFiscal(sale.id, stamp)
    return (await salesDb.find(sale.id)) ?? sale
  } catch (error) {
    const reason = error instanceof Error ? error.message : REJECTED
    console.error('Фискализация чека не прошла', reason)
    return queue(sale, kind, reason)
  }
}

export const fiscalService = {
  registerSale: async (sale: ISale) => apply(sale, FiscalDocumentKind.SALE),
  registerRefund: async (sale: ISale) => apply(sale, FiscalDocumentKind.REFUND),
  openShift: async (cashierName: string) => {
    if (!fiscalDriver.enabled) return
    try {
      await fiscalDriver.openShift(cashierName)
    } catch (error) {
      console.error('Регистратор не открыл смену', error)
    }
  },
  closeShift: async (cashierName: string) => {
    if (!fiscalDriver.enabled) return null
    try {
      return await fiscalDriver.closeShift(cashierName)
    } catch (error) {
      console.error('Регистратор не закрыл смену', error)
      return null
    }
  },
  status: async () => {
    const pending = await fiscalDb.pending()
    const online = fiscalDriver.enabled ? await fiscalDriver.probe() : false
    return {
      mode: config.fiscal.mode,
      transport: fiscalTransportKind,
      enabled: fiscalDriver.enabled,
      online,
      device: fiscalDriver.device(),
      pending,
      message: !fiscalDriver.enabled ? OFF : online ? ONLINE : OFFLINE,
    }
  },
}
