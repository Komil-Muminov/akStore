import { useCallback, useState } from 'react'
import type { IConversation, IMember } from '@/entities/message'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useMutationQuery } from '@/shared/hooks'

interface IRenameVariables {
  id: string
  title: string
}

interface IMemberVariables {
  id: string
  memberId: string
}

interface IAddVariables {
  id: string
  memberIds: string[]
}

const INVALIDATE = [QueryKeys.CHAT, QueryKeys.CHAT_MEMBERS]

export const useGroupPanel = (activeId: string | null) => {
  const [open, setOpen] = useState(false)

  const rename = useMutationQuery<IConversation, IRenameVariables>((v) => ApiRoutes.CHAT_RENAME(v.id), {
    method: 'PATCH',
    invalidate: INVALIDATE,
    body: (v) => ({ title: v.title }),
  })
  const addMembers = useMutationQuery<IMember[], IAddVariables>((v) => ApiRoutes.CHAT_ADD_MEMBERS(v.id), {
    invalidate: INVALIDATE,
    body: (v) => ({ memberIds: v.memberIds }),
  })
  const removeMember = useMutationQuery<IMember[], IMemberVariables>(
    (v) => ApiRoutes.CHAT_REMOVE_MEMBER(v.id),
    { invalidate: INVALIDATE, body: (v) => ({ memberId: v.memberId }) },
  )

  const renameMutate = rename.mutate
  const handleRename = useCallback(
    (title: string) => {
      if (activeId !== null) renameMutate({ id: activeId, title })
    },
    [activeId, renameMutate],
  )

  const addMutate = addMembers.mutate
  const handleAdd = useCallback(
    (memberIds: string[]) => {
      if (activeId !== null) addMutate({ id: activeId, memberIds })
    },
    [activeId, addMutate],
  )

  const removeMutate = removeMember.mutate
  const handleRemove = useCallback(
    (memberId: string) => {
      if (activeId !== null) removeMutate({ id: activeId, memberId })
    },
    [activeId, removeMutate],
  )

  return {
    open,
    show: useCallback(() => setOpen(true), []),
    hide: useCallback(() => setOpen(false), []),
    pending: rename.isPending || addMembers.isPending || removeMember.isPending,
    error: rename.error?.message ?? addMembers.error?.message ?? removeMember.error?.message,
    handleRename,
    handleAdd,
    handleRemove,
  }
}
