import { useCallback, useMemo, useState } from 'react'
import type { EventPayload } from '@gpuix/react'
import type { IPoint, IUnit } from '@/entities/unit'
import { IconButton, If, Text, Tooltip } from '@/shared/ui'
import { useCanvasInteraction } from './hooks'
import { draggedPoint, dropStateFor, findDropTarget, toScreen } from './lib'
import { CANVAS_HINT, EMPTY_HINT, type IProps } from './model'
import { empty, hint, miniMapToggle, root } from './style'
import { CanvasNode } from './ui/CanvasNode'
import { Edges } from './ui/Edges'
import { MiniMap } from './ui/MiniMap'
import { useElementBounds } from './useElementBounds'

interface IMiniMapListeners {
  onMove: (event: EventPayload) => void
  onUp: () => void
}

export const OrgCanvas = ({ units, positions, selectedId, disabled = false, onSelect, onMoveNode, onAttach }: IProps) => {
  const handlers = useMemo(() => ({ onSelect, onMoveNode, onAttach }), [onSelect, onMoveNode, onAttach])
  const {
    viewport,
    drag,
    grabNode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleScroll,
    centerOn,
    startMiniMapDrag,
    stopMiniMapDrag,
  } = useCanvasInteraction(units, handlers, disabled)
  const [canvasRef, canvasBounds, measureCanvas] = useElementBounds()
  const [miniMapListeners, setMiniMapListeners] = useState<IMiniMapListeners | null>(null)
  const [showMiniMap, setShowMiniMap] = useState(true)

  const toggleMiniMap = useCallback(() => setShowMiniMap((current) => !current), [])
  const target = useMemo(() => findDropTarget(units, drag, viewport.zoom), [units, drag, viewport.zoom])
  const names = useMemo(() => new Map(positions.map((position) => [position.id, position.name])), [positions])
  const pointOf = useCallback(
    (unit: IUnit) => toScreen(draggedPoint(unit, drag, viewport.zoom), viewport),
    [drag, viewport],
  )
  const handleCenter = useCallback((world: IPoint) => centerOn(world, measureCanvas()), [centerOn, measureCanvas])

  const handleCanvasMouseMove = useCallback(
    (event: EventPayload) => {
      handleMouseMove(event)
      miniMapListeners?.onMove(event)
    },
    [handleMouseMove, miniMapListeners],
  )

  const handleCanvasMouseUp = useCallback(() => {
    handleMouseUp()
    miniMapListeners?.onUp()
  }, [handleMouseUp, miniMapListeners])

  return (
    <div
      ref={canvasRef}
      testId="canvas"
      style={root}
      onMouseDown={handleMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onScroll={handleScroll}
    >
      <Edges units={units} pointOf={pointOf} zoom={viewport.zoom} />
      {units.map((unit) => (
        <CanvasNode
          key={unit.id}
          unit={unit}
          screen={pointOf(unit)}
          zoom={viewport.zoom}
          chips={unit.positionIds.map((id) => names.get(id) ?? '').filter(Boolean)}
          selected={unit.id === selectedId}
          dragging={drag?.id === unit.id && drag.moved}
          drop={dropStateFor(units, drag, target, unit)}
          onGrab={grabNode}
          onDragMove={handleCanvasMouseMove}
          onRelease={handleCanvasMouseUp}
        />
      ))}
      <If condition={units.length === 0}>
        <div style={empty}>
          <Text variant="secondary">{EMPTY_HINT}</Text>
        </div>
      </If>
      <div style={hint}>
        <Text variant="caption">{CANVAS_HINT}</Text>
      </div>
      <If condition={showMiniMap}>
        <MiniMap
          units={units}
          viewport={viewport}
          canvas={canvasBounds}
          hasDetails={selectedId !== null}
          onCenter={handleCenter}
          onStartDrag={startMiniMapDrag}
          onStopDrag={stopMiniMapDrag}
          onToggle={toggleMiniMap}
          onRegisterListeners={setMiniMapListeners}
        />
      </If>
      <If condition={!showMiniMap}>
        <div style={miniMapToggle(selectedId !== null)}>
          <Tooltip title="Показать мини-карту">
            <IconButton icon="map" onClick={toggleMiniMap} testId="canvas__minimap-show" />
          </Tooltip>
        </div>
      </If>
    </div>
  )
}
