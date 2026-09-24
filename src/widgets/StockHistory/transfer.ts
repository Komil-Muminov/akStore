import { useCallback, useState } from 'react'
import type { IOutlet, IOutletStock, ITransferInput } from '@/entities/outlet'
import type { IProduct } from '@/entities/product'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import type { IPagedResponse } from '@/shared/model'

const INVALIDATE = [QueryKeys.STOCK_HISTORY, QueryKeys.OUTLETS, QueryKeys.OUTLET_STOCKS, QueryKeys.PRODUCTS]
const PAGE_LIMIT = 100

export const useStockTransfer = () => {
  const [open, setOpen] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)

  const outlets = useGetQuery<IOutlet[]>(QueryKeys.OUTLETS, ApiRoutes.OUTLETS_LIST)
  const products = useGetQuery<IPagedResponse<IProduct>>(
    QueryKeys.PRODUCTS,
    ApiRoutes.PRODUCTS_SEARCH('', undefined, 1, PAGE_LIMIT),
  )
  const stocks = useGetQuery<IOutletStock[]>(
    QueryKeys.OUTLET_STOCKS,
    ApiRoutes.OUTLETS_STOCKS(productId ?? ''),
    productId !== null,
  )

  const transfer = useMutationQuery<IOutletStock[], ITransferInput>(ApiRoutes.OUTLETS_TRANSFER, {
    invalidate: INVALIDATE,
  })

  const openDialog = useCallback(() => setOpen(true), [])
  const closeDialog = useCallback(() => {
    setOpen(false)
    setProductId(null)
  }, [])

  const transferMutate = transfer.mutate
  const submit = useCallback(
    (fromOutletId: string, toOutletId: string, quantity: number, note: string) => {
      if (!productId) return
      transferMutate(
        { productId, fromOutletId, toOutletId, quantity, note },
        { onSuccess: closeDialog },
      )
    },
    [productId, transferMutate, closeDialog],
  )

  return {
    open,
    productId,
    outlets: outlets.data ?? [],
    products: products.data?.items ?? [],
    stocks: stocks.data ?? [],
    pending: transfer.isPending,
    error: transfer.error?.message,
    setProductId,
    openDialog,
    closeDialog,
    submit,
  }
}
