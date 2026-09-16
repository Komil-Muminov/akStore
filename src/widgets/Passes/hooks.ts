import type { IPass, IPassInput } from '@/entities/pass'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'

interface IUpdateVariables {
  id: string
  input: IPassInput
}

const INVALIDATE = [QueryKeys.PASSES]

export const usePassesQuery = () => useGetQuery<IPass[]>(QueryKeys.PASSES, ApiRoutes.PASSES_SEARCH)

export const usePassMutations = () => {
  const create = useMutationQuery<IPass, IPassInput>(ApiRoutes.PASSES_CREATE, { invalidate: INVALIDATE })
  const update = useMutationQuery<IPass, IUpdateVariables>((v) => ApiRoutes.PASSES_UPDATE(v.id), {
    method: 'PATCH',
    invalidate: INVALIDATE,
    body: (v) => v.input,
  })
  const revoke = useMutationQuery<IPass, string>(ApiRoutes.PASSES_DEACTIVATE, { method: 'PATCH', invalidate: INVALIDATE })
  const restore = useMutationQuery<IPass, string>(ApiRoutes.PASSES_ACTIVATE, { method: 'PATCH', invalidate: INVALIDATE })
  const remove = useMutationQuery<{ id: string }, string>(ApiRoutes.PASSES_DELETE, { method: 'DELETE', invalidate: INVALIDATE })
  const pending = revoke.isPending || restore.isPending || remove.isPending
  return { create, update, revoke, restore, remove, pending }
}
