import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import type { ElementBounds, EventPayload } from '@gpuix/react'
import type { IPoint, IUnit } from '@/entities/unit'
import { buildMiniMap, mapPointToWorld } from '../minimap'
import type { IViewport } from '../model'
import { accentOf, miniMap, miniMapNode, miniMapView, MINI_MAP } from '../style'
import { useElementBounds } from '../useElementBounds'

interface IMiniMapListeners {
  onMove: (event: EventPayload) => void
  onUp: () => void
}

interface IProps {
  units: IUnit[]
  viewport: IViewport
  canvas: ElementBounds
  onCenter: (world: IPoint) => void
  onCancelPan: () => void
  onRegisterListeners?: (listeners: IMiniMapListeners) => void
}

export const MiniMap = memo(({ units, viewport, canvas, onCenter, onCancelPan, onRegisterListeners }: IProps) => {
  const [ref, , measure] = useElementBounds()
  const dragOffsetRef = useRef<IPoint | null>(null)
  const model = useMemo(
    () => buildMiniMap(units, viewport, canvas, { x: 0, y: 0, width: MINI_MAP.width, height: MINI_MAP.height }),
    [units, viewport, canvas],
  )

  const updateCenterFromMouse = useCallback(
    (event: EventPayload) => {
      const bounds = measure()
      if (bounds.width === 0) return
      const rawLocal = { x: (event.x ?? 0) - bounds.x, y: (event.y ?? 0) - bounds.y }
      const offset = dragOffsetRef.current ?? { x: 0, y: 0 }
      const targetLocalCenter = {
        x: rawLocal.x - offset.x,
        y: rawLocal.y - offset.y,
      }
      onCenter(mapPointToWorld(model, targetLocalCenter))
    },
    [measure, model, onCenter],
  )

  const handleMouseDown = useCallback(
    (event: EventPayload) => {
      onCancelPan()
      const bounds = measure()
      if (bounds.width === 0) return
      const rawLocal = { x: (event.x ?? 0) - bounds.x, y: (event.y ?? 0) - bounds.y }
      const viewCenter = {
        x: model.view.x + model.view.width / 2,
        y: model.view.y + model.view.height / 2,
      }
      const insideView =
        rawLocal.x >= model.view.x &&
        rawLocal.x <= model.view.x + model.view.width &&
        rawLocal.y >= model.view.y &&
        rawLocal.y <= model.view.y + model.view.height

      dragOffsetRef.current = insideView
        ? { x: rawLocal.x - viewCenter.x, y: rawLocal.y - viewCenter.y }
        : { x: 0, y: 0 }

      updateCenterFromMouse(event)
    },
    [measure, model, onCancelPan, updateCenterFromMouse],
  )

  const handleMouseMove = useCallback(
    (event: EventPayload) => {
      if (dragOffsetRef.current !== null) updateCenterFromMouse(event)
    },
    [updateCenterFromMouse],
  )

  const handleMouseUp = useCallback(() => {
    dragOffsetRef.current = null
  }, [])

  useEffect(() => {
    onRegisterListeners?.({
      onMove: (event: EventPayload) => {
        if (dragOffsetRef.current !== null) updateCenterFromMouse(event)
      },
      onUp: () => {
        dragOffsetRef.current = null
      },
    })
  }, [onRegisterListeners, updateCenterFromMouse])

  return (
    <div
      ref={ref}
      testId="canvas__minimap"
      style={miniMap}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {model.nodes.map((node) => (
        <div
          key={node.id}
          style={miniMapNode(node.rect, accentOf(node.unit.type))}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      ))}
      <div
        style={miniMapView(model.view)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
})
