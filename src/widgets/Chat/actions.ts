import { useCallback, useState } from 'react'
import type { IMessage } from '@/entities/message'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useMutationQuery } from '@/shared/hooks'

interface IEditVariables {
  id: string
  body: string
}

const INVALIDATE = [QueryKeys.CHAT, QueryKeys.CHAT_HISTORY, QueryKeys.CHAT_UNREAD]

export const useMessageActions = (setDraft: (value: string) => void) => {
  const [editing, setEditing] = useState<IMessage | null>(null)
  const [removing, setRemoving] = useState<IMessage | null>(null)

  const edit = useMutationQuery<IMessage, IEditVariables>((v) => ApiRoutes.CHAT_EDIT_MESSAGE(v.id), {
    method: 'PATCH',
    invalidate: INVALIDATE,
    body: (v) => ({ body: v.body }),
  })
  const remove = useMutationQuery<IMessage, string>(ApiRoutes.CHAT_DELETE_MESSAGE, {
    method: 'DELETE',
    invalidate: INVALIDATE,
  })

  const startEdit = useCallback(
    (message: IMessage) => {
      setEditing(message)
      setDraft(message.body)
    },
    [setDraft],
  )

  const cancelEdit = useCallback(() => {
    setEditing(null)
    setDraft('')
  }, [setDraft])

  const editMutate = edit.mutate
  const submitEdit = useCallback(
    (body: string) => {
      if (editing === null) return
      editMutate(
        { id: editing.id, body },
        {
          onSuccess: () => {
            setEditing(null)
            setDraft('')
          },
        },
      )
    },
    [editing, editMutate, setDraft],
  )

  const removeMutate = remove.mutate
  const confirmRemove = useCallback(() => {
    if (removing === null) return
    removeMutate(removing.id, { onSuccess: () => setRemoving(null) })
  }, [removing, removeMutate])

  const cancelRemove = useCallback(() => setRemoving(null), [])

  return {
    editing,
    removing,
    pending: edit.isPending || remove.isPending,
    error: edit.error?.message,
    startEdit,
    cancelEdit,
    submitEdit,
    askRemove: setRemoving,
    confirmRemove,
    cancelRemove,
  }
}
