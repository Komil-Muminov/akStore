import { useCallback, useState } from 'react'
import type { ICartLine, IParkedSale } from '@/entities/sale'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'

interface IParkVariables {
  note: string
  lines: ICartLine[]
}

export const useParked = (onRestored: (lines: ICartLine[]) => void) => {
  const [open, setOpen] = useState(false)
  const list = useGetQuery<IParkedSale[]>(QueryKeys.PARKED, ApiRoutes.PARKED_LIST)

  const park = useMutationQuery<IParkedSale[], IParkVariables>(ApiRoutes.PARKED_PARK, {
    invalidate: [QueryKeys.PARKED],
  })
  const restore = useMutationQuery<IParkedSale, string>((id) => ApiRoutes.PARKED_RESTORE(id), {
    invalidate: [QueryKeys.PARKED],
  })
  const remove = useMutationQuery<IParkedSale[], string>((id) => ApiRoutes.PARKED_DELETE(id), {
    method: 'DELETE',
    invalidate: [QueryKeys.PARKED],
  })

  const parkMutate = park.mutate
  const handlePark = useCallback(
    (lines: ICartLine[], onDone: () => void) => parkMutate({ note: '', lines }, { onSuccess: onDone }),
    [parkMutate],
  )

  const restoreMutate = restore.mutate
  const handleRestore = useCallback(
    (id: string) => {
      restoreMutate(id, {
        onSuccess: (parked) => {
          onRestored(parked.lines)
          setOpen(false)
        },
      })
    },
    [restoreMutate, onRestored],
  )

  const removeMutate = remove.mutate
  const handleRemove = useCallback((id: string) => removeMutate(id), [removeMutate])

  return {
    open,
    parked: list.data ?? [],
    count: (list.data ?? []).length,
    pending: park.isPending || restore.isPending || remove.isPending,
    error: park.error?.message ?? restore.error?.message ?? remove.error?.message,
    openDialog: useCallback(() => setOpen(true), []),
    closeDialog: useCallback(() => setOpen(false), []),
    handlePark,
    handleRestore,
    handleRemove,
  }
}
