import { useCallback, useMemo, useState } from 'react'
import type { IProduct } from '@/entities/product'
import { cartSubtotalOf, cartTotalOf, discountAmountOf, DiscountKind, type ICartLine } from '@/entities/sale'
import { FiscalBadge } from '@/features/FiscalBadge'
import { SaleCart } from '@/features/SaleCart'
import { QuickPicks } from '@/features/QuickPicks'
import { SaleScanner } from '@/features/SaleScanner'
import { ShiftBar } from '@/features/ShiftBar'
import { useCategoriesQuery, useFavoritesQuery, useFiscalStatusQuery, useProductsQuery, useShiftQuery } from './hooks'
import { addToCart, changeLineDiscount, changeQuantity } from './lib'
import { useCashMoves } from './cash'
import { useCheckout } from './checkout'
import { usePosHotkeys } from './hotkeys'
import { useParked } from './parked'
import { SaleDialogs } from './ui/SaleDialogs'
import { badgeRow, main, root } from './style'

export const Sale = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [lines, setLines] = useState<ICartLine[]>([])
  const [discount, setDiscount] = useState(0)
  const [discountKind, setDiscountKind] = useState<string>(DiscountKind.AMOUNT)

  const products = useProductsQuery(query, category)
  const categories = useCategoriesQuery()
  const favorites = useFavoritesQuery()
  const shift = useShiftQuery()
  const fiscal = useFiscalStatusQuery()

  const items = useMemo(() => products.data?.items ?? [], [products.data?.items])
  const discountAmount = useMemo(
    () => discountAmountOf(discountKind, discount, cartSubtotalOf(lines)),
    [discountKind, discount, lines],
  )
  const total = useMemo(() => cartTotalOf(lines, discountAmount), [lines, discountAmount])

  const handleClear = useCallback(() => {
    setLines([])
    setDiscount(0)
  }, [])

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
  const handleDiscountKind = useCallback((value: string | null) => setDiscountKind(value ?? DiscountKind.AMOUNT), [])

  const handleRestored = useCallback((restored: ICartLine[]) => {
    setLines(restored)
    setDiscount(0)
  }, [])
  const parked = useParked(handleRestored)
  const cash = useCashMoves()
  const parkCart = parked.handlePark
  const handlePark = useCallback(() => parkCart(lines, handleClear), [parkCart, lines, handleClear])

  const checkout = useCheckout({ lines, total, discountAmount, onClear: handleClear })

  const handleFocusSearch = useCallback(() => {
    const input = document.querySelector('input')
    input?.focus()
  }, [])

  usePosHotkeys({
    canPark: lines.length > 0,
    cartTotal: total,
    onFocusSearch: handleFocusSearch,
    onPark: handlePark,
    onExactCash: checkout.handleExactCash,
    onExactCard: checkout.handleExactCard,
    onClear: handleClear,
  })

  const quickProducts = useMemo(() => {
    const favs = favorites.data?.items ?? []
    return favs.length > 0 ? favs : items.slice(0, 12)
  }, [favorites.data?.items, items])

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
        <QuickPicks products={quickProducts} onPick={handlePick} />
        <div style={badgeRow}>
          <FiscalBadge status={fiscal.data ?? null} />
        </div>
        <ShiftBar
          state={shift.data ?? null}
          cartTotal={total}
          pending={checkout.pending}
          error={checkout.error}
          notice={checkout.notice}
          onOpen={checkout.handleOpenShift}
          onClose={checkout.handleCloseShift}
          onPay={checkout.handlePay}
          onExactCash={checkout.handleExactCash}
          onExactCard={checkout.handleExactCard}
          lastSaleId={checkout.lastSaleId}
          onPrintReceipt={checkout.handlePrintReceipt}
          parkedCount={parked.count}
          canPark={lines.length > 0}
          onPark={handlePark}
          onOpenParked={parked.openDialog}
          onOpenCash={cash.openDialog}
        />
      </div>
      <SaleDialogs cash={cash} parked={parked} />
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
