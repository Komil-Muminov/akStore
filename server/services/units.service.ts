import { unitsDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { UnitType, type IUnit, type IUnitInput } from '../types'
import { canAttach } from './org.rules'

const NOT_FOUND = 'Подразделение не найдено'
const BAD_PARENT = 'Недопустимая привязка: проверьте тип родительского подразделения'
const HAS_CHILDREN = 'Сначала удалите или перенесите дочерние подразделения'
const ROOT_LOCKED = 'Корневой узел «Руководство» нельзя удалить или перенести'
const CYCLE = 'Нельзя привязать подразделение к собственному потомку'

const findOrThrow = async (id: string): Promise<IUnit> => {
  const unit = await unitsDb.find(id)
  if (!unit) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
  return unit
}

const parentTypeOf = async (parentId: string | null): Promise<UnitType | null> =>
  parentId === null ? null : (await findOrThrow(parentId)).type

const isDescendant = (all: IUnit[], candidateId: string, ancestorId: string): boolean => {
  let current = all.find((unit) => unit.id === candidateId) ?? null
  while (current?.parentId) {
    if (current.parentId === ancestorId) return true
    current = all.find((unit) => unit.id === current?.parentId) ?? null
  }
  return false
}

export const unitsService = {
  search: (): Promise<IUnit[]> => unitsDb.search(),
  create: async (input: IUnitInput): Promise<IUnit> => {
    if (!canAttach(input.type, await parentTypeOf(input.parentId))) {
      throw new HttpError(HttpStatus.BAD_REQUEST, BAD_PARENT)
    }
    return findOrThrow(await unitsDb.create(input))
  },
  update: async (id: string, name: string, x: number, y: number): Promise<IUnit> => {
    await findOrThrow(id)
    await unitsDb.update(id, name, x, y)
    return findOrThrow(id)
  },
  move: async (id: string, parentId: string | null): Promise<IUnit> => {
    const unit = await findOrThrow(id)
    if (unit.type === UnitType.LEADERSHIP) throw new HttpError(HttpStatus.BAD_REQUEST, ROOT_LOCKED)
    if (!canAttach(unit.type, await parentTypeOf(parentId))) throw new HttpError(HttpStatus.BAD_REQUEST, BAD_PARENT)
    if (parentId && isDescendant(await unitsDb.search(), parentId, id)) throw new HttpError(HttpStatus.BAD_REQUEST, CYCLE)
    await unitsDb.move(id, parentId)
    return findOrThrow(id)
  },
  setLayout: async (items: { id: string; x: number; y: number }[]): Promise<{ updated: number }> => {
    await unitsDb.setLayout(items)
    return { updated: items.length }
  },
  setPositions: async (id: string, positionIds: string[]): Promise<IUnit> => {
    await findOrThrow(id)
    await unitsDb.setPositions(id, positionIds)
    return findOrThrow(id)
  },
  remove: async (id: string): Promise<{ id: string }> => {
    const unit = await findOrThrow(id)
    if (unit.type === UnitType.LEADERSHIP) throw new HttpError(HttpStatus.BAD_REQUEST, ROOT_LOCKED)
    if ((await unitsDb.childrenCount(id)) > 0) throw new HttpError(HttpStatus.BAD_REQUEST, HAS_CHILDREN)
    await unitsDb.remove(id)
    return { id }
  },
}
