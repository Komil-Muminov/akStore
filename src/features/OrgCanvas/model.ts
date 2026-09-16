import type { IPoint, IUnit } from '@/entities/unit'
import type { IPosition } from '@/entities/position'

export interface IProps {
  units: IUnit[]
  positions: IPosition[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onMoveNode: (id: string, point: IPoint) => void
  onAttach: (childId: string, parentId: string) => void
}

export interface IViewport {
  pan: IPoint
  zoom: number
}

export interface IDragState {
  id: string
  origin: IPoint
  start: IPoint
  current: IPoint
  moved: boolean
}

export type TDropState = 'none' | 'allowed' | 'denied'

export const ZOOM_MIN = 0.4
export const ZOOM_MAX = 1.6
export const ZOOM_WHEEL_FACTOR = 0.0015
export const DRAG_THRESHOLD = 4
export const INITIAL_VIEWPORT: IViewport = { pan: { x: 48, y: 48 }, zoom: 1 }
export const EMPTY_HINT = 'Структура пуста — добавьте управление в панели справа'
export const CANVAS_HINT = 'Колесо — масштаб · Тянуть фон — перемещение · Тянуть узел на другой — привязать · Клик по мини-карте — перейти'
