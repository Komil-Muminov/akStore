import { hostsDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import type { IHost } from '../types'

const NOT_FOUND = 'Принимающий сотрудник не найден или не закреплён в структуре'
const NAME_SEPARATOR = ' — '
const UNIT_SEPARATOR = ' · '

export const hostLabel = (host: IHost) => `${host.fullName}${NAME_SEPARATOR}${host.positionName}${UNIT_SEPARATOR}${host.unitName}`

export const hostsService = {
  search: async () => hostsDb.search(),
  requireLabel: async (userId: string) => {
    const host = await hostsDb.findByUser(userId)
    if (!host) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_FOUND)
    return hostLabel(host)
  },
}
