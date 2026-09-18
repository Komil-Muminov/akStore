import { cashDb, shiftsDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { AuditAction, CashMoveKind } from '../types'
import { auditService } from './audit.service'

const LIST_LIMIT = 50
const NOT_OPEN = 'Открытой смены нет'
const WRONG_AMOUNT = 'Сумма должна быть больше нуля'
const NOT_ENOUGH = 'В кассе меньше наличных, чем изымается'

const requireShift = async (cashierId: string) => {
  const shift = await shiftsDb.current(cashierId)
  if (!shift) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_OPEN)
  return shift
}

export const cashService = {
  list: async (cashierId: string) => {
    const shift = await requireShift(cashierId)
    return cashDb.list(shift.id, LIST_LIMIT)
  },

  move: async (cashierId: string, kind: CashMoveKind, amount: number, note: string) => {
    if (amount <= 0) throw new HttpError(HttpStatus.BAD_REQUEST, WRONG_AMOUNT)
    const shift = await requireShift(cashierId)
    if (kind === CashMoveKind.OUT) {
      const totals = await shiftsDb.totals(shift.id, shift.openingCash)
      const adjustment = await cashDb.balance(shift.id)
      if (totals.expectedCash + adjustment < amount) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_ENOUGH)
    }
    await cashDb.create(shift.id, cashierId, kind, amount, note)
    if (kind === CashMoveKind.OUT) {
      await auditService.record(cashierId, AuditAction.CASH_OUT, note, shift.id, String(amount))
    }
    return cashDb.list(shift.id, LIST_LIMIT)
  },
}
