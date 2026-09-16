export enum UnitType {
  LEADERSHIP = 'leadership',
  MANAGEMENT = 'management',
  DEPARTMENT = 'department',
  SECTION = 'section',
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

export interface IUnitInput {
  name: string
  type: UnitType
  parentId: string | null
  x: number
  y: number
}

export interface IPoint {
  x: number
  y: number
}

export interface ISize {
  width: number
  height: number
}

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  [UnitType.LEADERSHIP]: 'Руководство',
  [UnitType.MANAGEMENT]: 'Управление',
  [UnitType.DEPARTMENT]: 'Отдел',
  [UnitType.SECTION]: 'Сектор',
}

export const CHILD_TYPE: Record<UnitType, UnitType | null> = {
  [UnitType.LEADERSHIP]: UnitType.MANAGEMENT,
  [UnitType.MANAGEMENT]: UnitType.DEPARTMENT,
  [UnitType.DEPARTMENT]: UnitType.SECTION,
  [UnitType.SECTION]: null,
}

export const PARENT_TYPE: Record<UnitType, UnitType | null> = {
  [UnitType.LEADERSHIP]: null,
  [UnitType.MANAGEMENT]: UnitType.LEADERSHIP,
  [UnitType.DEPARTMENT]: UnitType.MANAGEMENT,
  [UnitType.SECTION]: UnitType.DEPARTMENT,
}

export const UNIT_NAME_MIN_LENGTH = 2

export const NODE = {
  width: 220,
  headerHeight: 56,
  chipHeight: 22,
  maxChips: 4,
  padding: 12,
  gapX: 40,
  gapY: 80,
} as const
