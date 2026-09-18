import type { ICategory, IProduct, IProductInput } from '@/entities/product'
import { StockAction, type IStockSubmit } from '@/features/StockDialog'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import type { IPagedResponse } from '@/shared/model'

interface IUpdateVariables {
  id: string
  input: IProductInput
}

const INVALIDATE = [QueryKeys.PRODUCTS, QueryKeys.CATEGORIES]
const PAGE_LIMIT = 100

const STOCK_ROUTES: Record<StockAction, string> = {
  [StockAction.INCOME]: ApiRoutes.STOCK_INCOME,
  [StockAction.WRITE_OFF]: ApiRoutes.STOCK_WRITE_OFF,
  [StockAction.INVENTORY]: ApiRoutes.STOCK_INVENTORY,
}

export const useProductsQuery = (query: string, categoryId: string | null, outletId: string | null) =>
  useGetQuery<IPagedResponse<IProduct>>(
    QueryKeys.PRODUCTS,
    ApiRoutes.PRODUCTS_SEARCH(query, categoryId ?? undefined, 1, PAGE_LIMIT, undefined, outletId ?? undefined),
  )

export const useCategoriesQuery = () =>
  useGetQuery<ICategory[]>(QueryKeys.CATEGORIES, ApiRoutes.PRODUCTS_CATEGORIES)

export const useCategoryMutations = () => {
  const create = useMutationQuery<ICategory[], { name: string }>(ApiRoutes.CATEGORY_CREATE, {
    invalidate: INVALIDATE,
  })
  const rename = useMutationQuery<ICategory[], { id: string; name: string }>(
    (v) => ApiRoutes.CATEGORY_UPDATE(v.id),
    { method: 'PATCH', invalidate: INVALIDATE, body: (v) => ({ name: v.name }) },
  )
  const remove = useMutationQuery<ICategory[], string>(ApiRoutes.CATEGORY_DELETE, {
    method: 'DELETE',
    invalidate: INVALIDATE,
  })
  return { create, rename, remove }
}

export const useProductMutations = () => {
  const create = useMutationQuery<IProduct, IProductInput>(ApiRoutes.PRODUCTS_CREATE, { invalidate: INVALIDATE })
  const update = useMutationQuery<IProduct, IUpdateVariables>((v) => ApiRoutes.PRODUCTS_UPDATE(v.id), {
    method: 'PATCH',
    invalidate: INVALIDATE,
    body: (v) => v.input,
  })
  const archive = useMutationQuery<{ id: string }, string>(ApiRoutes.PRODUCTS_DELETE, {
    method: 'DELETE',
    invalidate: INVALIDATE,
  })
  const move = useMutationQuery<IProduct, IStockSubmit>((v) => STOCK_ROUTES[v.action], {
    invalidate: INVALIDATE,
    body: (v) => ({ productId: v.productId, quantity: v.quantity, costPrice: v.costPrice, note: v.note }),
  })
  return { create, update, archive, move }
}
