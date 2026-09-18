import type { IOutlet, IOutletInput, IOutletStock, ITransferInput } from '@/entities/outlet'
import type { IProduct } from '@/entities/product'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import type { IPagedResponse } from '@/shared/model'

interface IUpdateVariables {
  id: string
  input: IOutletInput
}

const INVALIDATE = [QueryKeys.OUTLETS, QueryKeys.OUTLET_STOCKS, QueryKeys.PRODUCTS]
const PAGE_LIMIT = 100

export const useOutletsQuery = () => useGetQuery<IOutlet[]>(QueryKeys.OUTLETS, ApiRoutes.OUTLETS_LIST)

export const useOutletStocksQuery = (productId: string | null) =>
  useGetQuery<IOutletStock[]>(QueryKeys.OUTLET_STOCKS, ApiRoutes.OUTLETS_STOCKS(productId ?? ''), productId !== null)

export const useTransferProductsQuery = (query: string) =>
  useGetQuery<IPagedResponse<IProduct>>(QueryKeys.PRODUCTS, ApiRoutes.PRODUCTS_SEARCH(query, undefined, 1, PAGE_LIMIT))

export const useOutletMutations = () => {
  const create = useMutationQuery<IOutlet, IOutletInput>(ApiRoutes.OUTLETS_CREATE, { invalidate: INVALIDATE })
  const update = useMutationQuery<IOutlet, IUpdateVariables>((v) => ApiRoutes.OUTLETS_UPDATE(v.id), {
    method: 'PATCH',
    invalidate: INVALIDATE,
    body: (v) => v.input,
  })
  const archive = useMutationQuery<{ id: string }, string>(ApiRoutes.OUTLETS_DELETE, {
    method: 'DELETE',
    invalidate: INVALIDATE,
  })
  const transfer = useMutationQuery<IOutletStock[], ITransferInput>(ApiRoutes.OUTLETS_TRANSFER, {
    invalidate: INVALIDATE,
  })
  return { create, update, archive, transfer }
}
