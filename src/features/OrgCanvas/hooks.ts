import { useCallback, useRef, useState } from 'react'
import type { EventPayload } from '@gpuix/react'
import { canAttach, type IPoint, type IUnit } from '@/entities/unit'
import { findDropTarget } from './lib'
import { DRAG_THRESHOLD, INITIAL_VIEWPORT, ZOOM_MAX, ZOOM_MIN, ZOOM_WHEEL_FACTOR, type IDragState, type IViewport } from './model'

interface IHandlers {
  onSelect: (id: string | null) => void
  onMoveNode: (id: string, point: IPoint) => void
  onAttach: (childId: string, parentId: string) => void
}

const pointOf = (event: EventPayload): IPoint => ({ x: event.x ?? 0, y: event.y ?? 0 })

const droppedPoint = (drag: IDragState, zoom: number): IPoint => ({
  x: drag.origin.x + (drag.current.x - drag.start.x) / zoom,
  y: drag.origin.y + (drag.current.y - drag.start.y) / zoom,
})

export const useCanvasInteraction = (units: IUnit[], handlers: IHandlers) => {
  const [viewport, setViewport] = useState<IViewport>(INITIAL_VIEWPORT)
  const [drag, setDrag] = useState<IDragState | null>(null)
  const dragRef = useRef<IDragState | null>(null)
  const panRef = useRef<{ start: IPoint; pan: IPoint } | null>(null)
  const isMiniMapActiveRef = useRef(false)
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport

  const updateDrag = useCallback((next: IDragState | null) => {
    dragRef.current = next
    setDrag(next)
  }, [])

  const startMiniMapDrag = useCallback(() => {
    isMiniMapActiveRef.current = true
    panRef.current = null
  }, [])

  const stopMiniMapDrag = useCallback(() => {
    isMiniMapActiveRef.current = false
  }, [])

  const grabNode = useCallback(
    (unit: IUnit, event: EventPayload) => {
      const start = pointOf(event)
      updateDrag({ id: unit.id, origin: { x: unit.x, y: unit.y }, start, current: start, moved: false })
    },
    [updateDrag],
  )

  const handleMouseDown = useCallback(
    (event: EventPayload) => {
      if (dragRef.current || isMiniMapActiveRef.current) return
      panRef.current = { start: pointOf(event), pan: viewportRef.current.pan }
      handlers.onSelect(null)
    },
    [handlers],
  )

  const handleMouseMove = useCallback(
    (event: EventPayload) => {
      if (isMiniMapActiveRef.current) return
      const point = pointOf(event)
      if (panRef.current) {
        const { start, pan } = panRef.current
        setViewport((current) => ({ ...current, pan: { x: pan.x + point.x - start.x, y: pan.y + point.y - start.y } }))
        return
      }
      const current = dragRef.current
      if (!current) return
      const moved = current.moved || Math.hypot(point.x - current.start.x, point.y - current.start.y) > DRAG_THRESHOLD
      updateDrag({ ...current, current: point, moved })
    },
    [updateDrag],
  )

  const handleMouseUp = useCallback(() => {
    panRef.current = null
    const current = dragRef.current
    if (!current) return
    const zoom = viewportRef.current.zoom
    const dragged = units.find((unit) => unit.id === current.id)
    const target = findDropTarget(units, current, zoom)
    if (!current.moved) {
      handlers.onSelect(current.id)
    } else if (dragged && target && canAttach(dragged, target) && dragged.parentId !== target.id) {
      handlers.onAttach(dragged.id, target.id)
    } else if (dragged && target === null) {
      handlers.onMoveNode(dragged.id, droppedPoint(current, zoom))
    }
    updateDrag(null)
  }, [units, handlers, updateDrag])

  const handleScroll = useCallback((event: EventPayload) => {
    const delta = event.deltaY ?? 0
    setViewport((current) => ({
      ...current,
      zoom: Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, current.zoom * (1 - delta * ZOOM_WHEEL_FACTOR))),
    }))
  }, [])

  const resetView = useCallback(() => setViewport(INITIAL_VIEWPORT), [])

  const centerOn = useCallback((world: IPoint, size: { width: number; height: number }) => {
    setViewport((current) => ({
      ...current,
      pan: { x: size.width / 2 - world.x * current.zoom, y: size.height / 2 - world.y * current.zoom },
    }))
  }, [])

  const cancelPan = useCallback(() => {
    panRef.current = null
  }, [])

  return {
    viewport,
    drag,
    grabNode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleScroll,
    resetView,
    centerOn,
    cancelPan,
    startMiniMapDrag,
    stopMiniMapDrag,
  }
}
