import type { UnitType } from './org'

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

export interface IHostRow {
  user_id: string
  full_name: string
  login: string
  position_id: string
  position_name: string
  rank: number | null
  unit_id: string
  unit_name: string
  unit_type: UnitType
  unit_path: string
}
