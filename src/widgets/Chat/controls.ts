import { useCallback, useState } from 'react'
import type { IGroupSubmit } from '@/features/ChatGroupForm'
import type { IConversation } from '@/entities/message'
import { socketClient } from '@/shared/lib'

interface IMutate<TVariables> {
  mutate: (
    variables: TVariables,
    options?: { onSuccess?: (result: IConversation) => void },
  ) => void
}

interface IOptions {
  open: IMutate<{ companionId: string }>
  createGroup: IMutate<IGroupSubmit>
  leave: { mutate: (id: string, options?: { onSuccess?: () => void }) => void }
  setDraft: (value: string) => void
  cancelEdit: () => void
}

export const useChatControls = ({ open, createGroup, leave, setDraft, cancelEdit }: IOptions) => {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [groupOpen, setGroupOpen] = useState(false)

  const select = useCallback(
    (conversationId: string) => {
      setActiveId(conversationId)
      cancelEdit()
    },
    [cancelEdit],
  )

  const reset = useCallback(
    (conversation: IConversation) => {
      setActiveId(conversation.id)
      setGroupOpen(false)
      setQuery('')
      setDraft('')
    },
    [setDraft],
  )

  const openMutate = open.mutate
  const openCompanion = useCallback(
    (companionId: string) => openMutate({ companionId }, { onSuccess: reset }),
    [openMutate, reset],
  )

  const createGroupMutate = createGroup.mutate
  const submitGroup = useCallback(
    (values: IGroupSubmit) => createGroupMutate(values, { onSuccess: reset }),
    [createGroupMutate, reset],
  )

  const leaveMutate = leave.mutate
  const leaveGroup = useCallback(() => {
    if (activeId === null) return
    leaveMutate(activeId, { onSuccess: () => setActiveId(null) })
  }, [activeId, leaveMutate])

  const changeDraft = useCallback(
    (value: string) => {
      setDraft(value)
      if (activeId !== null && value.length > 0) socketClient.notifyTyping(activeId)
    },
    [activeId, setDraft],
  )

  return {
    query,
    setQuery,
    activeId,
    setActiveId,
    groupOpen,
    openGroupForm: useCallback(() => setGroupOpen(true), []),
    closeGroupForm: useCallback(() => setGroupOpen(false), []),
    select,
    openCompanion,
    submitGroup,
    leaveGroup,
    changeDraft,
  }
}
