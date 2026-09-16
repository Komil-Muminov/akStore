import { UnitType } from '../types'

export const PARENT_TYPE: Record<UnitType, UnitType | null> = {
  [UnitType.LEADERSHIP]: null,
  [UnitType.MANAGEMENT]: UnitType.LEADERSHIP,
  [UnitType.DEPARTMENT]: UnitType.MANAGEMENT,
  [UnitType.SECTION]: UnitType.DEPARTMENT,
}

export const canAttach = (childType: UnitType, parentType: UnitType | null): boolean =>
  PARENT_TYPE[childType] === parentType
