import { useCallback, useState } from 'react'
import type { ICartLine } from '@/entities/sale'
import { ApiRoutes } from '@/shared/config'
import { openPrintable } from '@/shared/lib'
import { useSaleMutations } from './hooks'
import { NOTICE_TIMEOUT_MS, RECEIPT_FILE, SOLD_NOTICE } from './model'

interface IProps {
  lines: ICartLine[]
  total: number
  discountAmount: number
  onClear: () => void
}

export const useCheckout = ({ lines, total, discountAmount, onClear }: IProps) => {
  const [notice, setNotice] = useState<string | undefined>(undefined)
  const [lastSaleId, setLastSaleId] = useState<string | null>(null)
  const { openShift, closeShift, sell } = useSaleMutations()

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
            onClear()
            setNotice(SOLD_NOTICE)
            setLastSaleId(sale.id)
            setTimeout(() => setNotice(undefined), NOTICE_TIMEOUT_MS)
          },
        },
      )
    },
    [lines, discountAmount, sellMutate, onClear],
  )

  const handleExactCash = useCallback(() => {
    if (total <= 0) return
    handlePay(total, 0)
  }, [total, handlePay])

  const handleExactCard = useCallback(() => {
    if (total <= 0) return
    handlePay(0, total)
  }, [total, handlePay])

  const handlePrintReceipt = useCallback(() => {
    if (lastSaleId === null) return
    void openPrintable(ApiRoutes.SALES_PRINT(lastSaleId), RECEIPT_FILE)
  }, [lastSaleId])

  return {
    notice,
    lastSaleId,
    pending: sell.isPending || openShift.isPending || closeShift.isPending,
    error: sell.error?.message ?? openShift.error?.message ?? closeShift.error?.message,
    handleOpenShift,
    handleCloseShift,
    handlePay,
    handleExactCash,
    handleExactCard,
    handlePrintReceipt,
  }
}
