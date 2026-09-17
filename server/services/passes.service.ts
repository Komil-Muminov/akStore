import { passesDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { PassStatus, type IPass, type IPassInput, type IPassSearchParams } from '../types'
import { hostsService } from './hosts.service'
import { notifyHost } from './passes.notify'

const NOT_FOUND = 'Пропуск не найден'

const orNotFound = (pass: IPass | null): IPass => {
  if (!pass) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
  return pass
}

const withHostSnapshot = async (input: IPassInput) =>
  input.hostUserId ? { ...input, hostName: await hostsService.requireLabel(input.hostUserId) } : input

export const passesService = {
  search: async (params?: IPassSearchParams) => passesDb.search(params),
  find: async (id: string) => orNotFound(await passesDb.find(id)),
  create: async (input: IPassInput, authorId: string) => {
    const pass = await passesDb.create(await withHostSnapshot(input))
    await notifyHost(authorId, pass)
    return pass
  },
  update: async (id: string, input: IPassInput) => orNotFound(await passesDb.update(id, await withHostSnapshot(input))),
  deactivate: async (id: string) => orNotFound(await passesDb.setStatus(id, PassStatus.REVOKED)),
  activate: async (id: string) => orNotFound(await passesDb.setStatus(id, PassStatus.ACTIVE)),
  remove: async (id: string) => {
    const removed = await passesDb.remove(id)
    if (!removed) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return { id }
  },
}
