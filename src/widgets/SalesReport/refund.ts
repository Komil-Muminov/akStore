import { useCallback, useState } from 'react'
import type { ISale } from '@/entities/sale'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useMutationQuery } from '@/shared/hooks'

interface IRefundVariables {
  id: string
  items: { itemId: string; quantity: number }[]
}

const INVALIDATE = [QueryKeys.REPORT_SALES, QueryKeys.REPORT_SUMMARY, QueryKeys.PRODUCTS]

export const useRefund = () => {
  const [sale, setSale] = useState<ISale | null>(null)
  const [picked, setPicked] = useState<Record<string, number>>({})

  const refund = useMutationQuery<ISale, IRefundVariables>((v) => ApiRoutes.SALES_REFUND_ITEMS(v.id), {
    invalidate: INVALIDATE,
    body: (v) => ({ items: v.items }),
  })

  const open = useCallback((next: ISale) => {
    setSale(next)
    setPicked({})
  }, [])

  const close = useCallback(() => {
    setSale(null)
    setPicked({})
  }, [])

  const pick = useCallback(
    (itemId: string, quantity: number) => setPicked((current) => ({ ...current, [itemId]: Math.max(quantity, 0) })),
    [],
  )

  const refundMutate = refund.mutate
  const submit = useCallback(() => {
    if (!sale) return
    const items = Object.entries(picked)
      .filter(([, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }))
    if (items.length === 0) return
    refundMutate({ id: sale.id, items }, { onSuccess: close })
  }, [sale, picked, refundMutate, close])

  return { sale, picked, pending: refund.isPending, error: refund.error?.message, open, close, pick, submit }
}
