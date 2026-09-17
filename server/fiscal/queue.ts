import { fiscalDb, salesDb } from '../db'
import { config } from '../config'
import { documentOf } from './document'
import { FiscalDocumentKind, type IFiscalDriver } from './model'

const BATCH = 10
const MAX_ATTEMPTS = 50
const GIVE_UP = 'Чек не принят регистратором, требуется ручная фискализация'
const SECOND = 1000

let timer: ReturnType<typeof setInterval> | null = null

const kindOf = (value: string) =>
  value === FiscalDocumentKind.REFUND ? FiscalDocumentKind.REFUND : FiscalDocumentKind.SALE

const runTask = async (driver: IFiscalDriver, task: { id: string; sale_id: string; kind: string; attempts: string }) => {
  const sale = await salesDb.find(task.sale_id)
  if (!sale) {
    await fiscalDb.done(task.id)
    return
  }
  const stamp = await driver.register(documentOf(sale, kindOf(task.kind)))
  if (!stamp) throw new Error(GIVE_UP)
  await salesDb.attachFiscal(sale.id, stamp)
  await fiscalDb.done(task.id)
}

const tick = async (driver: IFiscalDriver) => {
  if (!driver.enabled) return
  const tasks = await fiscalDb.due(BATCH)
  for (const task of tasks) {
    try {
      await runTask(driver, task)
    } catch (error) {
      const reason = error instanceof Error ? error.message : GIVE_UP
      if (Number(task.attempts) + 1 >= MAX_ATTEMPTS) {
        await fiscalDb.defer(task.id, `${GIVE_UP}: ${reason}`, config.fiscal.retryDelay / SECOND)
        return
      }
      await fiscalDb.defer(task.id, reason, config.fiscal.retryDelay / SECOND)
    }
  }
}

export const startFiscalQueue = (driver: IFiscalDriver) => {
  if (timer || !driver.enabled) return
  timer = setInterval(() => {
    void tick(driver)
  }, config.fiscal.retryDelay)
}

export const stopFiscalQueue = () => {
  if (!timer) return
  clearInterval(timer)
  timer = null
}
