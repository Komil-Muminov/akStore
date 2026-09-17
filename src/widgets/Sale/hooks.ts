import type { ICategory, IProduct } from '@/entities/product'
import type { ISale, IShiftState } from '@/entities/sale'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import type { IPagedResponse } from '@/shared/model'

interface ISaleBody {
  items: { productId: string; quantity: number }[]
  payment: string
  discount: number
  paid: number
}

const INVALIDATE = [QueryKeys.SHIFT, QueryKeys.PRODUCTS, QueryKeys.SALES]
const PAGE_LIMIT = 50

export const useProductsQuery = (query: string, categoryId: string | null) =>
  useGetQuery<IPagedResponse<IProduct>>(
    QueryKeys.PRODUCTS,
    ApiRoutes.PRODUCTS_SEARCH(query, categoryId ?? undefined, 1, PAGE_LIMIT),
  )

export const useCategoriesQuery = () =>
  useGetQuery<ICategory[]>(QueryKeys.CATEGORIES, ApiRoutes.PRODUCTS_CATEGORIES)

export const useShiftQuery = () => useGetQuery<IShiftState | null>(QueryKeys.SHIFT, ApiRoutes.SHIFT_CURRENT)

export const useSaleMutations = () => {
  const openShift = useMutationQuery<IShiftState, { openingCash: number }>(ApiRoutes.SHIFT_OPEN, {
    invalidate: [QueryKeys.SHIFT],
  })
  const closeShift = useMutationQuery<IShiftState, { closingCash: number; note: string }>(ApiRoutes.SHIFT_CLOSE, {
    method: 'PATCH',
    invalidate: [QueryKeys.SHIFT],
  })
  const sell = useMutationQuery<ISale, ISaleBody>(ApiRoutes.SALES_CREATE, { invalidate: INVALIDATE })
  return { openShift, closeShift, sell }
}
