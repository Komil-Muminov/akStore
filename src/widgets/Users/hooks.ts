import type { IUser, IUserInput } from '@/entities/user'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'

import type { IPagedResponse } from '@/shared/model'

interface IUpdateVariables {
  id: string
  fullName: string
  isActive: boolean
}

interface IResetVariables {
  id: string
  password: string
}

const USERS = [QueryKeys.USERS]

export const useUsersQuery = (query?: string, page = 1) =>
  useGetQuery<IPagedResponse<IUser>>(QueryKeys.USERS, ApiRoutes.USERS_SEARCH(query, page))

export const useUserMutations = () => {
  const create = useMutationQuery<IUser, IUserInput>(ApiRoutes.USERS_CREATE, { invalidate: USERS })
  const update = useMutationQuery<IUser, IUpdateVariables>((v) => ApiRoutes.USERS_UPDATE(v.id), {
    method: 'PATCH',
    invalidate: USERS,
    body: (v) => ({ fullName: v.fullName, isActive: v.isActive }),
  })
  const resetPassword = useMutationQuery<{ id: string }, IResetVariables>((v) => ApiRoutes.USERS_RESET_PASSWORD(v.id), {
    method: 'PATCH',
    invalidate: [],
    body: (v) => ({ password: v.password }),
  })
  const remove = useMutationQuery<{ id: string }, string>(ApiRoutes.USERS_DELETE, { method: 'DELETE', invalidate: USERS })
  return { create, update, resetPassword, remove, pending: update.isPending || remove.isPending }
}
