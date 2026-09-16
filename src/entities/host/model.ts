import type { UnitType } from '@/entities/unit'

export interface IHost {
  userId: string
  fullName: string
  login: string
  positionId: string
  positionName: string
  rank: number | null
  unitId: string
  unitName: string
  unitType: UnitType
  unitPath: string
}

export const HOST_NAME_SEPARATOR = ' — '
export const HOST_UNIT_SEPARATOR = ' · '
