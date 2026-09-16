import type { StyleDesc } from '@gpuix/react'
import { NODE, UnitType } from '@/entities/unit'
import { theme } from '@/shared/config'
import type { TDropState } from './model'

const EDGE_WIDTH = 2
const TYPE_ACCENT: Record<UnitType, string> = {
  [UnitType.LEADERSHIP]: theme.colors.accent,
  [UnitType.MANAGEMENT]: theme.colors.info,
  [UnitType.DEPARTMENT]: '#A78BFA',
  [UnitType.SECTION]: '#FBBF24',
}
const DROP_COLOR: Record<TDropState, string | undefined> = {
  none: undefined,
  allowed: theme.colors.accent,
  denied: theme.colors.danger,
}

export const accentOf = (type: UnitType) => TYPE_ACCENT[type]

export const root: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  minWidth: 0,
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.colors.canvas,
  cursor: 'pointer',
  userSelect: 'none',
  active: { cursor: 'pointer' },
}

export const hint: StyleDesc = {
  position: 'absolute',
  left: theme.spacing.lg,
  bottom: theme.spacing.md,
  paddingLeft: theme.spacing.sm,
  paddingRight: theme.spacing.sm,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.overlay,
}

export const empty: StyleDesc = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }

export const node = (
  type: UnitType,
  zoom: number,
  x: number,
  y: number,
  height: number,
  selected: boolean,
  dragging: boolean,
  drop: TDropState,
): StyleDesc => ({
  position: 'absolute',
  left: x,
  top: y,
  width: NODE.width * zoom,
  height: height * zoom,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs * zoom,
  padding: NODE.padding * zoom,
  borderRadius: theme.radius.lg * zoom,
  borderWidth: selected || drop !== 'none' ? 2 : 1,
  borderColor: DROP_COLOR[drop] ?? (selected ? TYPE_ACCENT[type] : theme.colors.borderStrong),
  backgroundColor: dragging ? theme.colors.raisedHover : theme.colors.raised,
  opacity: dragging ? 0.85 : 1,
  cursor: 'pointer',
  active: { cursor: 'pointer' },
  boxShadow: { offsetX: 0, offsetY: 8 * zoom, blurRadius: 24 * zoom, spreadRadius: 0, color: '#00000066' },
  hover: { backgroundColor: theme.colors.raisedHover },
})

export const nodeHead: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }

export const typeMark = (type: UnitType, zoom: number): StyleDesc => ({
  width: theme.spacing.sm * zoom,
  height: theme.spacing.sm * zoom,
  borderRadius: theme.radius.full,
  backgroundColor: TYPE_ACCENT[type],
  flexShrink: 0,
})

export const nodeTitle = (zoom: number): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md * zoom,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.text,
  whiteSpace: 'nowrap',
})

export const nodeType = (type: UnitType, zoom: number): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs * zoom,
  color: TYPE_ACCENT[type],
})

export const chip = (zoom: number): StyleDesc => ({
  height: (NODE.chipHeight - theme.spacing.xxs) * zoom,
  paddingLeft: theme.spacing.sm * zoom,
  paddingRight: theme.spacing.sm * zoom,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.colors.overlay,
})

export const chipText = (zoom: number): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs * zoom,
  color: theme.colors.secondary,
  whiteSpace: 'nowrap',
})

export const edge = (x: number, y: number, width: number, height: number): StyleDesc => ({
  position: 'absolute',
  left: x,
  top: y,
  width: Math.max(width, EDGE_WIDTH),
  height: Math.max(height, EDGE_WIDTH),
  backgroundColor: theme.colors.ghost,
})

export const MINI_MAP = { width: 200, height: 140 } as const

export const miniMap: StyleDesc = {
  position: 'absolute',
  right: theme.spacing.lg,
  bottom: theme.spacing.md,
  width: MINI_MAP.width,
  height: MINI_MAP.height,
  overflow: 'hidden',
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.borderStrong,
  backgroundColor: '#0F172AE6',
  cursor: 'pointer',
  userSelect: 'none',
  active: { cursor: 'pointer' },
}

export const miniMapNode = (rect: { x: number; y: number; width: number; height: number }, color: string): StyleDesc => ({
  position: 'absolute',
  left: rect.x,
  top: rect.y,
  width: Math.max(rect.width, 2),
  height: Math.max(rect.height, 2),
  borderRadius: 2,
  backgroundColor: color,
  opacity: 0.8,
  cursor: 'pointer',
})

export const miniMapView = (rect: { x: number; y: number; width: number; height: number }): StyleDesc => ({
  position: 'absolute',
  left: rect.x,
  top: rect.y,
  width: Math.max(rect.width, 6),
  height: Math.max(rect.height, 6),
  borderRadius: 4,
  borderWidth: 1.5,
  borderColor: theme.colors.info,
  backgroundColor: theme.colors.infoSoft,
  cursor: 'pointer',
  active: { cursor: 'pointer' },
})

export const miniMapToggle: StyleDesc = {
  position: 'absolute',
  right: theme.spacing.lg,
  bottom: theme.spacing.md,
}

export const miniMapClose: StyleDesc = {
  position: 'absolute',
  right: 6,
  top: 6,
  width: 20,
  height: 20,
  borderRadius: 4,
  backgroundColor: '#0F172AB3',
  borderWidth: 1,
  borderColor: theme.colors.borderStrong,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  hover: { backgroundColor: theme.colors.raisedHover },
}
