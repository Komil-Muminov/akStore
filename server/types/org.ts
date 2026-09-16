export enum UnitType {
  LEADERSHIP = 'leadership',
  MANAGEMENT = 'management',
  DEPARTMENT = 'department',
  SECTION = 'section',
}

export interface IPosition {
  id: string
  name: string
  rank: number
}

export interface IPositionRow {
  id: string
  name: string
  rank: number
}

export interface IPositionInput {
  name: string
  rank: number
}

export interface IUnit {
  id: string
  name: string
  type: UnitType
  parentId: string | null
  x: number
  y: number
  positionIds: string[]
}

export interface IUnitRow {
  id: string
  name: string
  type: UnitType
  parent_id: string | null
  layout_x: number
  layout_y: number
  position_ids: string[] | null
}

export interface IUnitInput {
  name: string
  type: UnitType
  parentId: string | null
  x: number
  y: number
}
