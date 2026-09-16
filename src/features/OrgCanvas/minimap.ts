import { nodeSize, type IPoint, type IUnit } from '@/entities/unit'
import type { ElementBounds } from '@gpuix/react'
import type { IViewport } from './model'

export interface IRect {
  x: number
  y: number
  width: number
  height: number
}

export interface IMiniMapModel {
  scale: number
  origin: IPoint
  nodes: { id: string; rect: IRect; unit: IUnit }[]
  view: IRect
}

const WORLD_PADDING = 160

const contentBounds = (units: IUnit[]): IRect => {
  if (units.length === 0) {
    return { x: -400, y: -300, width: 800, height: 600 }
  }
  const rects = units.map((unit) => ({ x: unit.x, y: unit.y, ...nodeSize(unit) }))
  const minX = Math.min(...rects.map((rect) => rect.x)) - WORLD_PADDING
  const minY = Math.min(...rects.map((rect) => rect.y)) - WORLD_PADDING
  const maxX = Math.max(...rects.map((rect) => rect.x + rect.width)) + WORLD_PADDING
  const maxY = Math.max(...rects.map((rect) => rect.y + rect.height)) + WORLD_PADDING
  return { x: minX, y: minY, width: Math.max(maxX - minX, 400), height: Math.max(maxY - minY, 300) }
}

export const visibleWorldRect = (viewport: IViewport, canvas: ElementBounds): IRect => ({
  x: -viewport.pan.x / viewport.zoom,
  y: -viewport.pan.y / viewport.zoom,
  width: canvas.width / viewport.zoom,
  height: canvas.height / viewport.zoom,
})

export const buildMiniMap = (units: IUnit[], viewport: IViewport, canvas: ElementBounds, map: IRect): IMiniMapModel => {
  const view = visibleWorldRect(viewport, canvas)
  const world = contentBounds(units)
  const scale = Math.min(map.width / world.width, map.height / world.height)
  const origin = {
    x: (map.width - world.width * scale) / 2 - world.x * scale,
    y: (map.height - world.height * scale) / 2 - world.y * scale,
  }
  const project = (rect: IRect): IRect => ({
    x: origin.x + rect.x * scale,
    y: origin.y + rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  })
  return {
    scale,
    origin,
    nodes: units.map((unit) => ({ id: unit.id, unit, rect: project({ x: unit.x, y: unit.y, ...nodeSize(unit) }) })),
    view: project(view),
  }
}

export const mapPointToWorld = (model: IMiniMapModel, local: IPoint): IPoint => ({
  x: (local.x - model.origin.x) / model.scale,
  y: (local.y - model.origin.y) / model.scale,
})
