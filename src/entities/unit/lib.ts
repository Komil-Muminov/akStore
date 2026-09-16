import { NODE, PARENT_TYPE, UnitType, type IPoint, type ISize, type IUnit } from './model'

export const canAttach = (child: IUnit, parent: IUnit | null): boolean =>
  child.type !== UnitType.LEADERSHIP && PARENT_TYPE[child.type] === (parent?.type ?? null)

export const childrenOf = (units: IUnit[], parentId: string | null): IUnit[] =>
  units.filter((unit) => unit.parentId === parentId)

export const isDescendant = (units: IUnit[], candidateId: string, ancestorId: string): boolean => {
  let current = units.find((unit) => unit.id === candidateId) ?? null
  while (current?.parentId) {
    if (current.parentId === ancestorId) return true
    current = units.find((unit) => unit.id === current?.parentId) ?? null
  }
  return false
}

export const unitPath = (units: IUnit[], id: string | null): string[] => {
  const path: string[] = []
  let current = units.find((unit) => unit.id === id) ?? null
  while (current) {
    path.unshift(current.name)
    current = units.find((unit) => unit.id === current?.parentId) ?? null
  }
  return path
}

export const nodeSize = (unit: IUnit): ISize => ({
  width: NODE.width,
  height: NODE.headerHeight + Math.min(unit.positionIds.length, NODE.maxChips) * NODE.chipHeight + NODE.padding,
})

export const nodeCenter = (unit: IUnit, point: IPoint): IPoint => {
  const size = nodeSize(unit)
  return { x: point.x + size.width / 2, y: point.y + size.height / 2 }
}

export const containsPoint = (unit: IUnit, origin: IPoint, point: IPoint): boolean => {
  const size = nodeSize(unit)
  return point.x >= origin.x && point.x <= origin.x + size.width && point.y >= origin.y && point.y <= origin.y + size.height
}

export const nextChildPoint = (units: IUnit[], parent: IUnit): IPoint => {
  const siblings = childrenOf(units, parent.id)
  const right = siblings.reduce((max, unit) => Math.max(max, unit.x + NODE.width), parent.x - NODE.width - NODE.gapX)
  return { x: right + NODE.gapX, y: parent.y + nodeSize(parent).height + NODE.gapY }
}
