import { cashDb, outletsDb, reportsDb, shiftsDb, usersDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { AuditAction, UserRole, type IAuthUser } from '../types'
import { auditService } from './audit.service'
import { fiscalService } from './fiscal.service'
import { zReportHtml } from './shifts.report'

const LIST_LIMIT = 50
const ALREADY_OPEN = 'Смена уже открыта'
const NOT_OPEN = 'Открытой смены нет'
const NOT_FOUND = 'Смена не найдена'
const FOREIGN_SHIFT = 'Это смена другого кассира'

const EMPTY_FILTERS = { from: null, to: null, cashierId: null, payment: null, query: '' }

const totalsOf = async (shiftId: string, openingCash: number) => {
  const totals = await shiftsDb.totals(shiftId, openingCash)
  const adjustment = await cashDb.balance(shiftId)
  return { ...totals, cashAdjustment: adjustment, expectedCash: totals.expectedCash + adjustment }
}

export const shiftsService = {
  current: async (cashierId: string) => {
    const shift = await shiftsDb.current(cashierId)
    if (!shift) return null
    return { shift, totals: await totalsOf(shift.id, shift.openingCash) }
  },

  requireOpen: async (cashierId: string) => {
    const shift = await shiftsDb.current(cashierId)
    if (!shift) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_OPEN)
    return shift
  },

  open: async (cashierId: string, openingCash: number) => {
    if (await shiftsDb.current(cashierId)) throw new HttpError(HttpStatus.BAD_REQUEST, ALREADY_OPEN)
    const outletId = (await usersDb.outletOf(cashierId)) ?? (await outletsDb.first())
    const id = await shiftsDb.open(cashierId, openingCash, outletId)
    const shift = await shiftsDb.find(id)
    if (!shift) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    await fiscalService.openShift(shift.cashierName)
    return { shift, totals: await totalsOf(shift.id, shift.openingCash) }
  },

  close: async (cashierId: string, closingCash: number, note: string) => {
    const shift = await shiftsDb.current(cashierId)
    if (!shift) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_OPEN)
    const totals = await totalsOf(shift.id, shift.openingCash)
    await shiftsDb.close(shift.id, closingCash, note)
    const closed = await shiftsDb.find(shift.id)
    if (!closed) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    await auditService.record(
      cashierId,
      AuditAction.SHIFT_CLOSE,
      `Смена №${String(closed.number)}`,
      closed.id,
      `в кассе ${String(closingCash)}, ожидалось ${String(totals.expectedCash)}`,
    )
    const report = await fiscalService.closeShift(closed.cashierName)
    return { shift: closed, totals, report }
  },

  report: async (cashierId: string, shiftId: string) => {
    const shift = await shiftsDb.find(shiftId)
    if (!shift) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    if (shift.cashierId !== cashierId) throw new HttpError(HttpStatus.FORBIDDEN, FOREIGN_SHIFT)
    return { shift, totals: await totalsOf(shift.id, shift.openingCash) }
  },

  printable: async (actor: IAuthUser, shiftId: string) => {
    const shift = await shiftsDb.find(shiftId)
    if (!shift) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    if (shift.cashierId !== actor.id && actor.role !== UserRole.SUPERADMIN && actor.role !== UserRole.ADMIN) {
      throw new HttpError(HttpStatus.FORBIDDEN, FOREIGN_SHIFT)
    }
    const totals = await totalsOf(shift.id, shift.openingCash)
    const summary = await reportsDb.summary({ ...EMPTY_FILTERS, shiftId })
    return zReportHtml(shift, totals, summary, null)
  },

  list: async () => shiftsDb.list(LIST_LIMIT),
}
