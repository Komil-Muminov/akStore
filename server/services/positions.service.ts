import { positionsDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import type { IPositionInput } from '../types'

const NOT_FOUND = 'Должность не найдена'
const IN_USE = 'Должность используется в структуре — сначала уберите её из подразделений'
const DUPLICATE = 'Должность с таким названием уже существует'

export const positionsService = {
  search: async (query?: string) => positionsDb.search(query),
  create: async (input: IPositionInput) => {
    const trimmed = input.name.trim()
    const all = await positionsDb.search(trimmed)
    const exists = all.some((p) => p.name.trim().toLowerCase() === trimmed.toLowerCase())
    if (exists) throw new HttpError(HttpStatus.BAD_REQUEST, DUPLICATE)
    return positionsDb.create({ ...input, name: trimmed })
  },
  update: async (id: string, input: IPositionInput) => {
    const position = await positionsDb.update(id, input)
    if (!position) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return position
  },
  remove: async (id: string) => {
    if ((await positionsDb.usageCount(id)) > 0) throw new HttpError(HttpStatus.BAD_REQUEST, IN_USE)
    const removed = await positionsDb.remove(id)
    if (!removed) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return { id }
  },
}

