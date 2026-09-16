import { HOST_NAME_SEPARATOR, HOST_UNIT_SEPARATOR, type IHost } from './model'
import type { ISelectOption } from '@/shared/ui'

export const hostLabel = (host: IHost) =>
  `${host.fullName}${HOST_NAME_SEPARATOR}${host.positionName}${HOST_UNIT_SEPARATOR}${host.unitName}`

export const hostOptions = (hosts: IHost[]): ISelectOption[] =>
  hosts.map((host) => ({
    id: host.userId,
    label: host.fullName,
    description: `${host.positionName}${HOST_UNIT_SEPARATOR}${host.unitPath}`,
    group: host.unitPath.split(' / ').slice(0, 2).join(' / '),
    keywords: [host.login, host.positionName, host.unitPath],
  }))
