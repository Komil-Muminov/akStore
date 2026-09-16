import { canAttach, containsPoint, isDescendant, nodeCenter, type IPoint, type IUnit } from '@/entities/unit'
import type { IDragState, IViewport, TDropState } from './model'

export const toScreen = (point: IPoint, viewport: IViewport): IPoint => ({
  x: point.x * viewport.zoom + viewport.pan.x,
  y: point.y * viewport.zoom + viewport.pan.y,
})

export const draggedPoint = (unit: IUnit, drag: IDragState | null, zoom: number): IPoint =>
  drag && drag.id === unit.id
    ? { x: drag.origin.x + (drag.current.x - drag.start.x) / zoom, y: drag.origin.y + (drag.current.y - drag.start.y) / zoom }
    : { x: unit.x, y: unit.y }

export const findDropTarget = (units: IUnit[], drag: IDragState | null, zoom: number): IUnit | null => {
  if (!drag || !drag.moved) return null
  const dragged = units.find((unit) => unit.id === drag.id)
  if (!dragged) return null
  const center = nodeCenter(dragged, draggedPoint(dragged, drag, zoom))
  return (
    units.find(
      (unit) =>
        unit.id !== dragged.id &&
        containsPoint(unit, { x: unit.x, y: unit.y }, center) &&
        !isDescendant(units, unit.id, dragged.id),
    ) ?? null
  )
}

export const dropStateFor = (units: IUnit[], drag: IDragState | null, target: IUnit | null, unit: IUnit): TDropState => {
  if (!drag || !target || target.id !== unit.id) return 'none'
  const dragged = units.find((entry) => entry.id === drag.id)
  return dragged && canAttach(dragged, target) && dragged.parentId !== target.id ? 'allowed' : 'denied'
}
