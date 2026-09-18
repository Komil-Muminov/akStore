import type { IDebtor, IDebtorCard, IDebtorInput } from '@/entities/debt'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'

interface IUpdateVariables {
  id: string
  input: IDebtorInput
}

interface IMoveVariables {
  id: string
  amount: number
  note: string
}

const INVALIDATE = [QueryKeys.DEBTS, QueryKeys.DEBTOR]

export const useDebtorsQuery = (query: string) =>
  useGetQuery<IDebtor[]>(QueryKeys.DEBTS, ApiRoutes.DEBTS_SEARCH(query))

export const useDebtorCardQuery = (id: string | null) =>
  useGetQuery<IDebtorCard>(QueryKeys.DEBTOR, ApiRoutes.DEBTS_FIND(id ?? ''), id !== null)

export const useDebtorMutations = () => {
  const create = useMutationQuery<IDebtor, IDebtorInput>(ApiRoutes.DEBTS_CREATE, { invalidate: INVALIDATE })
  const update = useMutationQuery<IDebtor, IUpdateVariables>((v) => ApiRoutes.DEBTS_UPDATE(v.id), {
    method: 'PATCH',
    invalidate: INVALIDATE,
    body: (v) => v.input,
  })
  const archive = useMutationQuery<{ id: string }, string>(ApiRoutes.DEBTS_DELETE, {
    method: 'DELETE',
    invalidate: INVALIDATE,
  })
  const lend = useMutationQuery<IDebtor, IMoveVariables>((v) => ApiRoutes.DEBTS_LEND(v.id), {
    invalidate: INVALIDATE,
    body: (v) => ({ amount: v.amount, note: v.note }),
  })
  const repay = useMutationQuery<IDebtor, IMoveVariables>((v) => ApiRoutes.DEBTS_REPAY(v.id), {
    invalidate: INVALIDATE,
    body: (v) => ({ amount: v.amount, note: v.note }),
  })
  return { create, update, archive, lend, repay }
}
