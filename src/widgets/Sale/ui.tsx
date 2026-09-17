import { useCallback, useEffect, useMemo, useState } from 'react'
import type { IProduct } from '@/entities/product'
import { cartTotalOf, type ICartLine } from '@/entities/sale'
import { FiscalBadge } from '@/features/FiscalBadge'
import { SaleCart } from '@/features/SaleCart'
import { SaleScanner } from '@/features/SaleScanner'
import { ShiftBar } from '@/features/ShiftBar'
import { useCategoriesQuery, useFiscalStatusQuery, useProductsQuery, useSaleMutations, useShiftQuery } from './hooks'
import { addToCart, changeQuantity } from './lib'
import { NOTICE_TIMEOUT_MS, SOLD_NOTICE } from './model'
import { badgeRow, main, root } from './style'

export const Sale = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [lines, setLines] = useState<ICartLine[]>([])
  const [discount, setDiscount] = useState(0)
  const [notice, setNotice] = useState<string | undefined>(undefined)
  const products = useProductsQuery(query, category)
  const categories = useCategoriesQuery()
  const shift = useShiftQuery()
  const fiscal = useFiscalStatusQuery()
  const { openShift, closeShift, sell } = useSaleMutations()

  const items = useMemo(() => products.data?.items ?? [], [products.data?.items])
  const total = useMemo(() => cartTotalOf(lines, discount), [lines, discount])

  useEffect(() => {
    if (notice === undefined) return
    const timer = setTimeout(() => setNotice(undefined), NOTICE_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [notice])

  const handlePick = useCallback((product: IProduct) => {
    setLines((current) => addToCart(current, product))
    setQuery('')
  }, [])

  const handleSubmit = useCallback(() => {
    const exact = items.find((product) => product.barcode === query.trim())
    if (exact) handlePick(exact)
  }, [items, query, handlePick])

  const handleQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) => changeQuantity(current, productId, quantity))
  }, [])

  const handleRemove = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId))
  }, [])

  const handleClear = useCallback(() => {
    setLines([])
    setDiscount(0)
  }, [])

  const openMutate = openShift.mutate
  const handleOpenShift = useCallback((openingCash: number) => openMutate({ openingCash }), [openMutate])

  const closeMutate = closeShift.mutate
  const handleCloseShift = useCallback(
    (closingCash: number, note: string) => closeMutate({ closingCash, note }),
    [closeMutate],
  )

  const sellMutate = sell.mutate
  const handlePay = useCallback(
    (payment: string, paid: number) => {
      sellMutate(
        {
          items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
          payment,
          discount,
          paid,
        },
        {
          onSuccess: () => {
            setLines([])
            setDiscount(0)
            setNotice(SOLD_NOTICE)
          },
        },
      )
    },
    [lines, discount, sellMutate],
  )

  return (
    <div style={root} testId="sale__layout">
      <div style={main}>
        <SaleScanner
          query={query}
          products={items}
          categories={categories.data ?? []}
          activeCategory={category}
          loading={products.isPending}
          error={products.error?.message}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          onCategoryChange={setCategory}
          onPick={handlePick}
        />
        <div style={badgeRow}>
          <FiscalBadge status={fiscal.data ?? null} />
        </div>
        <ShiftBar
          state={shift.data ?? null}
          cartTotal={total}
          pending={sell.isPending || openShift.isPending || closeShift.isPending}
          error={sell.error?.message ?? openShift.error?.message ?? closeShift.error?.message}
          notice={notice}
          onOpen={handleOpenShift}
          onClose={handleCloseShift}
          onPay={handlePay}
        />
      </div>
      <SaleCart
        lines={lines}
        discount={discount}
        onQuantityChange={handleQuantity}
        onRemove={handleRemove}
        onDiscountChange={setDiscount}
        onClear={handleClear}
      />
    </div>
  )
}
