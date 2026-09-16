import { HttpError, HttpStatus, optionalString, requireString, requireUuid } from '../shared/utils'
import { UnitType, type IPositionInput, type IUnitInput } from '../types'

const NAME_MIN = 2
const NAME_MAX = 120
const DEFAULT_RANK = 100
const UNIT_TYPES = Object.values(UnitType)

const numberOf = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

export const parsePositionInput = (body: unknown): IPositionInput => {
  const raw = (body ?? {}) as Record<string, unknown>
  return { name: requireString(raw.name, 'name', NAME_MIN, NAME_MAX), rank: numberOf(raw.rank, DEFAULT_RANK) }
}

export const parseUnitInput = (body: unknown): IUnitInput => {
  const raw = (body ?? {}) as Record<string, unknown>
  const type = optionalString(raw.type, 'type', NAME_MAX) as UnitType
  if (!UNIT_TYPES.includes(type)) throw new HttpError(HttpStatus.BAD_REQUEST, 'Недопустимый тип подразделения')
  return {
    name: requireString(raw.name, 'name', NAME_MIN, NAME_MAX),
    type,
    parentId: raw.parentId === null || raw.parentId === undefined ? null : requireUuid(raw.parentId, 'parentId'),
    x: numberOf(raw.x, 0),
    y: numberOf(raw.y, 0),
  }
}

export const parseUnitUpdate = (body: unknown) => {
  const raw = (body ?? {}) as Record<string, unknown>
  return { name: requireString(raw.name, 'name', NAME_MIN, NAME_MAX), x: numberOf(raw.x, 0), y: numberOf(raw.y, 0) }
}

export const parseParentId = (body: unknown): string | null => {
  const raw = (body ?? {}) as Record<string, unknown>
  return raw.parentId === null || raw.parentId === undefined ? null : requireUuid(raw.parentId, 'parentId')
}

export const parseLayout = (body: unknown): { id: string; x: number; y: number }[] => {
  const raw = (body ?? {}) as Record<string, unknown>
  const items = Array.isArray(raw.items) ? (raw.items as Record<string, unknown>[]) : []
  return items.map((item) => ({ id: requireUuid(item.id, 'id'), x: numberOf(item.x, 0), y: numberOf(item.y, 0) }))
}

export const parsePositionIds = (body: unknown): string[] => {
  const raw = (body ?? {}) as Record<string, unknown>
  const ids = Array.isArray(raw.positionIds) ? raw.positionIds : []
  return ids.map((id) => requireUuid(id, 'positionIds'))
}
