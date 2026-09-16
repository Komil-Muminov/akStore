import { CHILD_TYPE, UnitType, autoLayout, childrenOf, nextChildPoint, type IUnit, type IUnitInput } from '@/entities/unit'
import type { IUnitFormState } from '@/features/UnitForm'

export const rootOf = (units: IUnit[]): IUnit | null => units.find((unit) => unit.type === UnitType.LEADERSHIP) ?? null

export const createFormFor = (parent: IUnit): IUnitFormState | null => {
  const type = CHILD_TYPE[parent.type]
  return type ? { mode: 'create', type, parent } : null
}

export const renameFormFor = (unit: IUnit): IUnitFormState => ({ mode: 'rename', type: unit.type, parent: null, unit })

export const inputFor = (units: IUnit[], form: IUnitFormState, name: string): IUnitInput => {
  const point = form.parent ? nextChildPoint(units, form.parent) : { x: 0, y: 0 }
  return { name, type: form.type, parentId: form.parent?.id ?? null, x: point.x, y: point.y }
}

export const layoutItems = (units: IUnit[]) =>
  Object.entries(autoLayout(units)).map(([id, point]) => ({ id, x: point.x, y: point.y }))

export const hasChildren = (units: IUnit[], id: string): boolean => childrenOf(units, id).length > 0
