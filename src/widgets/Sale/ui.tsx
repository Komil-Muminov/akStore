import { useCallback, useEffect, useMemo, useState } from 'react'
import type { IProduct } from '@/entities/product'
import { cartSubtotalOf, cartTotalOf, discountAmountOf, DiscountKind, type ICartLine } from '@/entities/sale'
import { FiscalBadge } from '@/features/FiscalBadge'
import { ParkedSales } from '@/features/ParkedSales'
import { SaleCart } from '@/features/SaleCart'
import { QuickPicks } from '@/features/QuickPicks'
import { SaleScanner } from '@/features/SaleScanner'
import { ShiftBar } from '@/features/ShiftBar'
import { ApiRoutes } from '@/shared/config'
import { openPrintable } from '@/shared/lib'
import {
  useCategoriesQuery,
  useFavoritesQuery,
  useFiscalStatusQuery,
  useProductsQuery,
  useSaleMutations,
  useShiftQuery,
} from './hooks'
import { addToCart, changeLineDiscount, changeQuantity } from './lib'
import { useParked } from './parked'
import { NOTICE_TIMEOUT_MS, RECEIPT_FILE, SOLD_NOTICE } from './model'
import { badgeRow, main, root } from './style'

export const Sale = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [lines, setLines] = useState<ICartLine[]>([])
  const [discount, setDiscount] = useState(0)
  const [discountKind, setDiscountKind] = useState<string>(DiscountKind.AMOUNT)
  const [notice, setNotice] = useState<string | undefined>(undefined)
  const [lastSaleId, setLastSaleId] = useState<string | null>(null)
  const products = useProductsQuery(query, category)
  const categories = useCategoriesQuery()
  const favorites = useFavoritesQuery()
  const shift = useShiftQuery()
  const fiscal = useFiscalStatusQuery()
  const { openShift, closeShift, sell } = useSaleMutations()

  const items = useMemo(() => products.data?.items ?? [], [products.data?.items])
  const discountAmount = useMemo(
    () => discountAmountOf(discountKind, discount, cartSubtotalOf(lines)),
    [discountKind, discount, lines],
  )
  const total = useMemo(() => cartTotalOf(lines, discountAmount), [lines, discountAmount])

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

  const handleLineDiscount = useCallback((productId: string, value: number) => {
    setLines((current) => changeLineDiscount(current, productId, value))
  }, [])

  const handleRemove = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId))
  }, [])

  const handleClear = useCallback(() => {
    setLines([])
    setDiscount(0)
  }, [])

  const handleDiscountKind = useCallback((value: string | null) => setDiscountKind(value ?? DiscountKind.AMOUNT), [])

  const handleRestored = useCallback((restored: ICartLine[]) => {
    setLines(restored)
    setDiscount(0)
  }, [])
  const parked = useParked(handleRestored)
  const parkCart = parked.handlePark
  const handlePark = useCallback(() => parkCart(lines, handleClear), [parkCart, lines, handleClear])

  const openMutate = openShift.mutate
  const handleOpenShift = useCallback((openingCash: number) => openMutate({ openingCash }), [openMutate])

  const closeMutate = closeShift.mutate
  const handleCloseShift = useCallback(
    (closingCash: number, note: string) => closeMutate({ closingCash, note }),
    [closeMutate],
  )

  const sellMutate = sell.mutate
  const handlePay = useCallback(
    (cashPaid: number, cardPaid: number) => {
      sellMutate(
        {
          items: lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            discount: line.discount,
          })),
          discount: discountAmount,
          cashPaid,
          cardPaid,
        },
        {
          onSuccess: (sale) => {
            setLines([])
            setDiscount(0)
            setNotice(SOLD_NOTICE)
            setLastSaleId(sale.id)
          },
        },
      )
    },
    [lines, discountAmount, sellMutate],
  )

  const handlePrintReceipt = useCallback(() => {
    if (lastSaleId === null) return
    void openPrintable(ApiRoutes.SALES_PRINT(lastSaleId), RECEIPT_FILE)
  }, [lastSaleId])

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
        <QuickPicks products={favorites.data?.items ?? []} onPick={handlePick} />
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
          lastSaleId={lastSaleId}
          onPrintReceipt={handlePrintReceipt}
          parkedCount={parked.count}
          canPark={lines.length > 0}
          onPark={handlePark}
          onOpenParked={parked.openDialog}
        />
      </div>
      <ParkedSales
        open={parked.open}
        parked={parked.parked}
        pending={parked.pending}
        error={parked.error}
        onRestore={parked.handleRestore}
        onRemove={parked.handleRemove}
        onClose={parked.closeDialog}
      />
      <SaleCart
        lines={lines}
        discount={discount}
        discountKind={discountKind}
        onQuantityChange={handleQuantity}
        onLineDiscountChange={handleLineDiscount}
        onRemove={handleRemove}
        onDiscountChange={setDiscount}
        onDiscountKindChange={handleDiscountKind}
        onClear={handleClear}
      />
    </div>
  )
}
