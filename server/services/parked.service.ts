import { parkedDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import type { IParkedLine } from '../types'

const LIST_LIMIT = 20
const NOT_FOUND = 'Отложенный чек не найден'
const EMPTY_LINES = 'Нечего откладывать'
const LIMIT_REACHED = `Уже отложено ${LIST_LIMIT} чеков, разберите их`

const totalOf = (lines: IParkedLine[]) =>
  Math.round(lines.reduce((sum, line) => sum + line.price * line.quantity - line.discount, 0) * 100) / 100

export const parkedService = {
  list: async (cashierId: string) => parkedDb.list(cashierId, LIST_LIMIT),

  park: async (cashierId: string, note: string, lines: IParkedLine[]) => {
    if (lines.length === 0) throw new HttpError(HttpStatus.BAD_REQUEST, EMPTY_LINES)
    const parked = await parkedDb.list(cashierId, LIST_LIMIT)
    if (parked.length >= LIST_LIMIT) throw new HttpError(HttpStatus.BAD_REQUEST, LIMIT_REACHED)
    await parkedDb.create(cashierId, note, totalOf(lines), lines)
    return parkedDb.list(cashierId, LIST_LIMIT)
  },

  restore: async (cashierId: string, id: string) => {
    const parked = await parkedDb.find(id, cashierId)
    if (!parked) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    await parkedDb.remove(id, cashierId)
    return parked
  },

  remove: async (cashierId: string, id: string) => {
    if (!(await parkedDb.remove(id, cashierId))) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return parkedDb.list(cashierId, LIST_LIMIT)
  },
}
