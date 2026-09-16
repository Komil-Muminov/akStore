import { memo, useCallback } from 'react'
import type { EventPayload } from '@gpuix/react'
import { NODE, UNIT_TYPE_LABELS, nodeSize, type IPoint, type IUnit } from '@/entities/unit'
import { If } from '@/shared/ui'
import type { TDropState } from '../model'
import { chip, chipText, node, nodeHead, nodeTitle, nodeType, typeMark } from '../style'

interface IProps {
  unit: IUnit
  screen: IPoint
  zoom: number
  chips: string[]
  selected: boolean
  dragging: boolean
  drop: TDropState
  onGrab: (unit: IUnit, event: EventPayload) => void
  onDragMove: (event: EventPayload) => void
  onRelease: (event: EventPayload) => void
}

const MORE_PREFIX = '+'

export const CanvasNode = memo(({ unit, screen, zoom, chips, selected, dragging, drop, onGrab, onDragMove, onRelease }: IProps) => {
  const handleMouseDown = useCallback((event: EventPayload) => onGrab(unit, event), [onGrab, unit])
  const visible = chips.slice(0, NODE.maxChips)
  const hidden = chips.length - visible.length

  return (
    <div
      testId={`canvas__node-${unit.id}`}
      onMouseDown={handleMouseDown}
      onMouseMove={onDragMove}
      onMouseUp={onRelease}
      style={node(unit.type, zoom, screen.x, screen.y, nodeSize(unit).height, selected, dragging, drop)}
    >
      <div style={nodeHead}>
        <div style={typeMark(unit.type, zoom)} />
        <text style={nodeType(unit.type, zoom)}>{UNIT_TYPE_LABELS[unit.type]}</text>
      </div>
      <text style={nodeTitle(zoom)}>{unit.name}</text>
      {visible.map((name, index) => (
        <div key={`${unit.id}-${String(index)}`} style={chip(zoom)}>
          <text style={chipText(zoom)}>{index === visible.length - 1 && hidden > 0 ? `${name} ${MORE_PREFIX}${String(hidden)}` : name}</text>
        </div>
      ))}
      <If condition={chips.length === 0}>
        <text style={chipText(zoom)}>{''}</text>
      </If>
    </div>
  )
})
