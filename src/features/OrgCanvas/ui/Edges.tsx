import { NODE, nodeSize, type IPoint, type IUnit } from '@/entities/unit'
import { edge } from '../style'

interface IProps {
  units: IUnit[]
  pointOf: (unit: IUnit) => IPoint
  zoom: number
}

interface ISegment {
  key: string
  x: number
  y: number
  width: number
  height: number
}

const segmentsFor = (parent: IUnit, child: IUnit, pointOf: (unit: IUnit) => IPoint, zoom: number): ISegment[] => {
  const from = pointOf(parent)
  const to = pointOf(child)
  const startX = from.x + (NODE.width * zoom) / 2
  const startY = from.y + nodeSize(parent).height * zoom
  const endX = to.x + (NODE.width * zoom) / 2
  const endY = to.y
  const midY = startY + (endY - startY) / 2
  const left = Math.min(startX, endX)
  return [
    { key: `${child.id}-a`, x: startX, y: startY, width: 0, height: Math.max(midY - startY, 0) },
    { key: `${child.id}-b`, x: left, y: midY, width: Math.abs(endX - startX), height: 0 },
    { key: `${child.id}-c`, x: endX, y: midY, width: 0, height: Math.max(endY - midY, 0) },
  ]
}

export const Edges = ({ units, pointOf, zoom }: IProps) => (
  <>
    {units.flatMap((child) => {
      const parent = units.find((unit) => unit.id === child.parentId)
      return parent ? segmentsFor(parent, child, pointOf, zoom) : []
    }).map((segment) => (
      <div key={segment.key} style={edge(segment.x, segment.y, segment.width, segment.height)} />
    ))}
  </>
)
