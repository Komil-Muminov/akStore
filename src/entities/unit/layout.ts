import { NODE, type IPoint, type IUnit } from './model'
import { childrenOf, nodeSize } from './lib'

type TLayout = Record<string, IPoint>

const subtreeWidth = (units: IUnit[], unit: IUnit): number => {
  const children = childrenOf(units, unit.id)
  if (children.length === 0) return NODE.width
  const total = children.reduce((sum, child) => sum + subtreeWidth(units, child), 0)
  return total + NODE.gapX * (children.length - 1)
}

const place = (units: IUnit[], unit: IUnit, left: number, top: number, layout: TLayout): void => {
  const width = subtreeWidth(units, unit)
  layout[unit.id] = { x: left + (width - NODE.width) / 2, y: top }
  const children = childrenOf(units, unit.id)
  const nextTop = top + nodeSize(unit).height + NODE.gapY
  let cursor = left
  children.forEach((child) => {
    place(units, child, cursor, nextTop, layout)
    cursor += subtreeWidth(units, child) + NODE.gapX
  })
}

export const autoLayout = (units: IUnit[]): TLayout => {
  const layout: TLayout = {}
  let cursor = 0
  childrenOf(units, null).forEach((root) => {
    place(units, root, cursor, 0, layout)
    cursor += subtreeWidth(units, root) + NODE.gapX * 2
  })
  return layout
}
