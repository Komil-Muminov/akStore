import { positionsDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import type { IPosition, IPositionInput } from '../types'

const NOT_FOUND = 'Должность не найдена'
const IN_USE = 'Должность используется в структуре — сначала уберите её из подразделений'

export const positionsService = {
  search: (): Promise<IPosition[]> => positionsDb.search(),
  create: (input: IPositionInput): Promise<IPosition> => positionsDb.create(input),
  update: async (id: string, input: IPositionInput): Promise<IPosition> => {
    const position = await positionsDb.update(id, input)
    if (!position) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return position
  },
  remove: async (id: string): Promise<{ id: string }> => {
    if ((await positionsDb.usageCount(id)) > 0) throw new HttpError(HttpStatus.BAD_REQUEST, IN_USE)
    const removed = await positionsDb.remove(id)
    if (!removed) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return { id }
  },
}
