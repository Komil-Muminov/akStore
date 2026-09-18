import { debtsDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import type { IDebtorInput } from '../types'

const LIST_LIMIT = 100
const MOVES_LIMIT = 100
const NOT_FOUND = 'Должник не найден'
const NAME_TAKEN = 'Должник с таким именем уже есть'
const WRONG_AMOUNT = 'Сумма должна быть больше нуля'

const orNotFound = async (id: string) => {
  const debtor = await debtsDb.find(id)
  if (!debtor) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
  return debtor
}

export const debtsService = {
  search: async (query: string) => debtsDb.list(query, LIST_LIMIT),

  find: async (id: string) => ({ debtor: await orNotFound(id), moves: await debtsDb.moves(id, MOVES_LIMIT) }),

  create: async (input: IDebtorInput) => {
    if (await debtsDb.findByName(input.name)) throw new HttpError(HttpStatus.BAD_REQUEST, NAME_TAKEN)
    return orNotFound(await debtsDb.create(input))
  },

  update: async (id: string, input: IDebtorInput) => {
    await orNotFound(id)
    const twin = await debtsDb.findByName(input.name)
    if (twin && twin !== id) throw new HttpError(HttpStatus.BAD_REQUEST, NAME_TAKEN)
    await debtsDb.update(id, input)
    return orNotFound(id)
  },

  archive: async (id: string) => {
    await orNotFound(id)
    await debtsDb.archive(id)
    return { id }
  },

  lend: async (authorId: string, id: string, amount: number, note: string) => {
    if (amount <= 0) throw new HttpError(HttpStatus.BAD_REQUEST, WRONG_AMOUNT)
    await orNotFound(id)
    await debtsDb.addMove(id, null, authorId, amount, note)
    return orNotFound(id)
  },

  repay: async (authorId: string, id: string, amount: number, note: string) => {
    if (amount <= 0) throw new HttpError(HttpStatus.BAD_REQUEST, WRONG_AMOUNT)
    await orNotFound(id)
    await debtsDb.addMove(id, null, authorId, -amount, note)
    return orNotFound(id)
  },
}
