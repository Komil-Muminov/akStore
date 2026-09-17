import { shiftsDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'

const LIST_LIMIT = 50
const ALREADY_OPEN = 'Смена уже открыта'
const NOT_OPEN = 'Открытой смены нет'
const NOT_FOUND = 'Смена не найдена'
const FOREIGN_SHIFT = 'Это смена другого кассира'

export const shiftsService = {
  current: async (cashierId: string) => {
    const shift = await shiftsDb.current(cashierId)
    if (!shift) return null
    return { shift, totals: await shiftsDb.totals(shift.id, shift.openingCash) }
  },

  requireOpen: async (cashierId: string) => {
    const shift = await shiftsDb.current(cashierId)
    if (!shift) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_OPEN)
    return shift
  },

  open: async (cashierId: string, openingCash: number) => {
    if (await shiftsDb.current(cashierId)) throw new HttpError(HttpStatus.BAD_REQUEST, ALREADY_OPEN)
    const id = await shiftsDb.open(cashierId, openingCash)
    const shift = await shiftsDb.find(id)
    if (!shift) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return { shift, totals: await shiftsDb.totals(shift.id, shift.openingCash) }
  },

  close: async (cashierId: string, closingCash: number, note: string) => {
    const shift = await shiftsDb.current(cashierId)
    if (!shift) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_OPEN)
    const totals = await shiftsDb.totals(shift.id, shift.openingCash)
    await shiftsDb.close(shift.id, closingCash, note)
    const closed = await shiftsDb.find(shift.id)
    if (!closed) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return { shift: closed, totals }
  },

  report: async (cashierId: string, shiftId: string) => {
    const shift = await shiftsDb.find(shiftId)
    if (!shift) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    if (shift.cashierId !== cashierId) throw new HttpError(HttpStatus.FORBIDDEN, FOREIGN_SHIFT)
    return { shift, totals: await shiftsDb.totals(shift.id, shift.openingCash) }
  },

  list: async () => shiftsDb.list(LIST_LIMIT),
}
