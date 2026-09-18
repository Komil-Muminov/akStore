import { useCallback, useState } from 'react'
import type { ICountResult, ICountSheetLine } from '@/features/StocktakeDialog'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import { openPrintable, useOutletScope } from '@/shared/lib'

interface IApplyVariables {
  note: string
  lines: { productId: string; counted: number }[]
}

const INVALIDATE = [QueryKeys.STOCK_HISTORY, QueryKeys.PRODUCTS, QueryKeys.COUNT_SHEET, QueryKeys.OUTLETS]
const PRINT_FILE = 'vedomost.html'

export const useStocktake = () => {
  const outletId = useOutletScope()
  const [open, setOpen] = useState(false)
  const [counted, setCounted] = useState<Record<string, string>>({})
  const [note, setNote] = useState('')
  const [result, setResult] = useState<ICountResult | null>(null)

  const sheet = useGetQuery<ICountSheetLine[]>(QueryKeys.COUNT_SHEET, ApiRoutes.COUNT_SHEET(outletId), open)
  const apply = useMutationQuery<ICountResult, IApplyVariables>(ApiRoutes.COUNT_APPLY(outletId), {
    invalidate: INVALIDATE,
  })

  const reset = useCallback(() => {
    setCounted({})
    setNote('')
    setResult(null)
  }, [])

  const applyMutate = apply.mutate
  const submit = useCallback(() => {
    const lines = Object.entries(counted)
      .filter(([, value]) => value.trim().length > 0)
      .map(([productId, value]) => ({ productId, counted: Number(value.replace(',', '.')) || 0 }))
    if (lines.length === 0) return
    applyMutate({ note, lines }, { onSuccess: (data) => setResult(data) })
  }, [counted, note, applyMutate])

  return {
    open,
    lines: sheet.data ?? [],
    counted,
    note,
    result,
    pending: apply.isPending,
    error: apply.error?.message,
    openDialog: useCallback(() => {
      reset()
      setOpen(true)
    }, [reset]),
    closeDialog: useCallback(() => {
      setOpen(false)
      reset()
    }, [reset]),
    count: useCallback((productId: string, value: string) => setCounted((c) => ({ ...c, [productId]: value })), []),
    setNote,
    print: useCallback(() => void openPrintable(ApiRoutes.COUNT_PRINT(outletId), PRINT_FILE), [outletId]),
    submit,
  }
}
