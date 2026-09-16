import { passesDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { PassStatus, type IPass, type IPassInput } from '../types'

const NOT_FOUND = 'Пропуск не найден'

const orNotFound = (pass: IPass | null): IPass => {
  if (!pass) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
  return pass
}

export const passesService = {
  search: (): Promise<IPass[]> => passesDb.search(),
  create: (input: IPassInput): Promise<IPass> => passesDb.create(input),
  update: async (id: string, input: IPassInput): Promise<IPass> => orNotFound(await passesDb.update(id, input)),
  deactivate: async (id: string): Promise<IPass> => orNotFound(await passesDb.setStatus(id, PassStatus.REVOKED)),
  activate: async (id: string): Promise<IPass> => orNotFound(await passesDb.setStatus(id, PassStatus.ACTIVE)),
  remove: async (id: string): Promise<{ id: string }> => {
    const removed = await passesDb.remove(id)
    if (!removed) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return { id }
  },
}
