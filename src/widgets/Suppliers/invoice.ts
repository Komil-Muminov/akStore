import { useCallback, useState } from 'react'
import type { IProduct } from '@/entities/product'
import { invoiceTotalOf, type IInvoiceLine } from '@/entities/supplier'

export const useInvoiceDraft = () => {
  const [open, setOpen] = useState(false)
  const [supplierId, setSupplierId] = useState<string | null>(null)
  const [lines, setLines] = useState<IInvoiceLine[]>([])
  const [paid, setPaid] = useState('')
  const [note, setNote] = useState('')

  const reset = useCallback(() => {
    setSupplierId(null)
    setLines([])
    setPaid('')
    setNote('')
  }, [])

  const addProduct = useCallback((product: IProduct | undefined) => {
    if (!product) return
    setLines((current) =>
      current.some((line) => line.productId === product.id)
        ? current
        : [...current, { productId: product.id, name: product.name, quantity: 1, costPrice: product.costPrice }],
    )
  }, [])

  const changeLine = useCallback((productId: string, quantity: number, costPrice: number) => {
    setLines((current) =>
      current.map((line) =>
        line.productId === productId ? { ...line, quantity: Math.max(quantity, 0), costPrice: Math.max(costPrice, 0) } : line,
      ),
    )
  }, [])

  const removeLine = useCallback(
    (productId: string) => setLines((current) => current.filter((line) => line.productId !== productId)),
    [],
  )

  return {
    open,
    supplierId,
    lines,
    paid,
    note,
    total: invoiceTotalOf(lines),
    openDialog: useCallback(() => {
      reset()
      setOpen(true)
    }, [reset]),
    closeDialog: useCallback(() => setOpen(false), []),
    setSupplierId,
    setPaid,
    setNote,
    addProduct,
    changeLine,
    removeLine,
    reset,
  }
}
