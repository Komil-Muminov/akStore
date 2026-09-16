import type { IPoint, IUnit, IUnitInput } from '@/entities/unit'
import type { IPosition, IPositionInput } from '@/entities/position'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'

interface IMoveVariables {
  id: string
  parentId: string | null
}

interface IUpdateVariables {
  id: string
  name: string
  point: IPoint
}

interface IPositionsVariables {
  id: string
  positionIds: string[]
}

interface ILayoutVariables {
  items: { id: string; x: number; y: number }[]
}

const UNITS = [QueryKeys.UNITS]
const POSITIONS = [QueryKeys.POSITIONS]

export const useUnitsQuery = () => useGetQuery<IUnit[]>(QueryKeys.UNITS, ApiRoutes.UNITS_SEARCH)
export const usePositionsQuery = () => useGetQuery<IPosition[]>(QueryKeys.POSITIONS, ApiRoutes.POSITIONS_SEARCH)

export const useUnitMutations = () => {
  const create = useMutationQuery<IUnit, IUnitInput>(ApiRoutes.UNITS_CREATE, { invalidate: UNITS })
  const update = useMutationQuery<IUnit, IUpdateVariables>((v) => ApiRoutes.UNITS_UPDATE(v.id), {
    method: 'PATCH',
    invalidate: UNITS,
    body: (v) => ({ name: v.name, x: v.point.x, y: v.point.y }),
  })
  const move = useMutationQuery<IUnit, IMoveVariables>((v) => ApiRoutes.UNITS_MOVE(v.id), {
    method: 'PATCH',
    invalidate: UNITS,
    body: (v) => ({ parentId: v.parentId }),
  })
  const setLayout = useMutationQuery<{ updated: number }, ILayoutVariables>(ApiRoutes.UNITS_SET_LAYOUT, {
    method: 'PATCH',
    invalidate: UNITS,
  })
  const setPositions = useMutationQuery<IUnit, IPositionsVariables>((v) => ApiRoutes.UNITS_SET_POSITIONS(v.id), {
    method: 'PATCH',
    invalidate: UNITS,
    body: (v) => ({ positionIds: v.positionIds }),
  })
  const remove = useMutationQuery<{ id: string }, string>(ApiRoutes.UNITS_DELETE, { method: 'DELETE', invalidate: UNITS })
  const pending = create.isPending || update.isPending || move.isPending || setLayout.isPending || remove.isPending
  return { create, update, move, setLayout, setPositions, remove, pending }
}

export const usePositionMutations = () => {
  const create = useMutationQuery<IPosition, IPositionInput>(ApiRoutes.POSITIONS_CREATE, { invalidate: POSITIONS })
  const remove = useMutationQuery<{ id: string }, string>(ApiRoutes.POSITIONS_DELETE, {
    method: 'DELETE',
    invalidate: [...POSITIONS, ...UNITS],
  })
  return { create, remove, pending: create.isPending || remove.isPending }
}
