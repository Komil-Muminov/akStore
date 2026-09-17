import { entriesDb, passesDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { EntryDirection, PassStatus, type IEntriesParams, type IPass } from '../types'

const ENTRIES_LIMIT = 500
const PASS_MISSING = 'Пропуск не найден'
const PASS_REVOKED = 'Пропуск отозван, проход запрещён'
const ALREADY_INSIDE = 'Посетитель уже отмечен на входе'
const NOT_INSIDE = 'Посетитель не отмечен на входе'

const requireActive = async (passId: string) => {
  const pass = await passesDb.find(passId)
  if (!pass) throw new HttpError(HttpStatus.NOT_FOUND, PASS_MISSING)
  if (pass.status !== PassStatus.ACTIVE) throw new HttpError(HttpStatus.BAD_REQUEST, PASS_REVOKED)
  return pass
}

const isInside = async (passId: string) => {
  const last = await entriesDb.last(passId)
  return last?.direction === EntryDirection.IN
}

const register = async (pass: IPass, direction: EntryDirection, guardId: string) => {
  await entriesDb.create(pass.id, direction, guardId)
  return { pass, direction, happenedAt: new Date().toISOString() }
}

export const entriesService = {
  findByCode: async (code: string) => {
    const pass = await passesDb.findByCode(code)
    if (!pass) throw new HttpError(HttpStatus.NOT_FOUND, PASS_MISSING)
    return { pass, inside: await isInside(pass.id) }
  },

  checkIn: async (guardId: string, passId: string) => {
    const pass = await requireActive(passId)
    if (await isInside(passId)) throw new HttpError(HttpStatus.BAD_REQUEST, ALREADY_INSIDE)
    return register(pass, EntryDirection.IN, guardId)
  },

  checkOut: async (guardId: string, passId: string) => {
    const pass = await passesDb.find(passId)
    if (!pass) throw new HttpError(HttpStatus.NOT_FOUND, PASS_MISSING)
    if (!(await isInside(passId))) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_INSIDE)
    return register(pass, EntryDirection.OUT, guardId)
  },

  onSite: async () => entriesDb.onSite(),

  search: async (params: IEntriesParams) => entriesDb.search(params, Math.min(params.limit ?? ENTRIES_LIMIT, ENTRIES_LIMIT)),
}
