import type { IProduct } from '@/entities/product'
import type { IInvoice, ISupplier, ISupplierInput } from '@/entities/supplier'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import type { IPagedResponse } from '@/shared/model'

interface IUpdateVariables {
  id: string
  input: ISupplierInput
}

interface IReceiveVariables {
  supplierId: string
  paid: number
  note: string
  items: { productId: string; quantity: number; costPrice: number }[]
}

const INVALIDATE = [QueryKeys.SUPPLIERS, QueryKeys.INVOICES, QueryKeys.PRODUCTS, QueryKeys.OUTLETS]
const PAGE_LIMIT = 200

export const useSuppliersQuery = (query: string) =>
  useGetQuery<ISupplier[]>(QueryKeys.SUPPLIERS, ApiRoutes.SUPPLIERS_SEARCH(query))

export const useInvoicesQuery = (supplierId: string | null) =>
  useGetQuery<IInvoice[]>(QueryKeys.INVOICES, ApiRoutes.SUPPLIERS_INVOICES(supplierId))

export const useCatalogQuery = () =>
  useGetQuery<IPagedResponse<IProduct>>(QueryKeys.PRODUCTS, ApiRoutes.PRODUCTS_SEARCH('', undefined, 1, PAGE_LIMIT))

export const useSupplierMutations = () => {
  const create = useMutationQuery<ISupplier, ISupplierInput>(ApiRoutes.SUPPLIERS_CREATE, { invalidate: INVALIDATE })
  const update = useMutationQuery<ISupplier, IUpdateVariables>((v) => ApiRoutes.SUPPLIERS_UPDATE(v.id), {
    method: 'PATCH',
    invalidate: INVALIDATE,
    body: (v) => v.input,
  })
  const archive = useMutationQuery<{ id: string }, string>(ApiRoutes.SUPPLIERS_DELETE, {
    method: 'DELETE',
    invalidate: INVALIDATE,
  })
  const receive = useMutationQuery<IInvoice, IReceiveVariables>(ApiRoutes.SUPPLIERS_RECEIVE, {
    invalidate: INVALIDATE,
  })
  const pay = useMutationQuery<IInvoice, { id: string; amount: number }>((v) => ApiRoutes.SUPPLIERS_PAY(v.id), {
    invalidate: INVALIDATE,
    body: (v) => ({ amount: v.amount }),
  })
  return { create, update, archive, receive, pay }
}
