import { useCallback, useState } from 'react'
import type { ICashMove } from '@/entities/debt'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'

interface IMoveVariables {
  kind: string
  amount: number
  note: string
}

export const useCashMoves = () => {
  const [open, setOpen] = useState(false)
  const list = useGetQuery<ICashMove[]>(QueryKeys.CASH, ApiRoutes.CASH_LIST)
  const move = useMutationQuery<ICashMove[], IMoveVariables>(ApiRoutes.CASH_MOVE, {
    invalidate: [QueryKeys.CASH, QueryKeys.SHIFT],
  })

  const moveMutate = move.mutate
  const handleMove = useCallback(
    (kind: string, amount: number, note: string) => moveMutate({ kind, amount, note }),
    [moveMutate],
  )

  return {
    open,
    moves: list.data ?? [],
    pending: move.isPending,
    error: move.error?.message,
    openDialog: useCallback(() => setOpen(true), []),
    closeDialog: useCallback(() => setOpen(false), []),
    handleMove,
  }
}
