import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChatComposer } from '@/features/ChatComposer'
import { ChatGroupForm, type IGroupSubmit } from '@/features/ChatGroupForm'
import { ChatSidebar } from '@/features/ChatSidebar'
import { ChatThread } from '@/features/ChatThread'
import { If, Spinner } from '@/shared/ui'
import { socketClient, useSession } from '@/shared/lib'
import { isGroup } from '@/entities/message'
import {
  useChatMutations,
  useCompanionsQuery,
  useConversationsQuery,
  useHistoryQuery,
  useMembersQuery,
  useOnlineQuery,
} from './hooks'
import { useChatRealtime } from './realtime'
import { filterCompanions } from './lib'
import { pane, root } from './style'
import { ErrorState } from './ui/ErrorState'

export const Chat = () => {
  const currentUserId = useSession()?.user.id ?? ''
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [groupOpen, setGroupOpen] = useState(false)
  const conversations = useConversationsQuery()
  const companions = useCompanionsQuery()
  const history = useHistoryQuery(activeId)
  const { open, send, read, createGroup, leave } = useChatMutations()
  const onlineQuery = useOnlineQuery()
  const { online, setOnline, typingName } = useChatRealtime(activeId)

  const items = useMemo(() => conversations.data ?? [], [conversations.data])
  const active = useMemo(() => items.find((item) => item.id === activeId) ?? null, [items, activeId])
  const members = useMembersQuery(activeId, active !== null && isGroup(active))
  const colleagues = useMemo(
    () => filterCompanions(companions.data ?? [], '', currentUserId),
    [companions.data, currentUserId],
  )
  const found = useMemo(
    () => filterCompanions(companions.data ?? [], query, currentUserId),
    [companions.data, query, currentUserId],
  )

  const readMutate = read.mutate
  useEffect(() => {
    if (activeId !== null) readMutate(activeId)
  }, [activeId, readMutate])

  const initialOnline = onlineQuery.data
  useEffect(() => {
    if (initialOnline) setOnline(initialOnline)
  }, [initialOnline, setOnline])

  const refetch = conversations.refetch
  const handleRetry = useCallback(() => void refetch(), [refetch])

  const handleSelect = useCallback((conversationId: string) => {
    setActiveId(conversationId)
    setDraft('')
  }, [])

  const openMutate = open.mutate
  const handleOpenCompanion = useCallback(
    (companionId: string) => {
      openMutate(
        { companionId },
        {
          onSuccess: (conversation) => {
            setActiveId(conversation.id)
            setQuery('')
            setDraft('')
          },
        },
      )
    },
    [openMutate],
  )

  const createGroupMutate = createGroup.mutate
  const handleCreateGroup = useCallback(
    (values: IGroupSubmit) => {
      createGroupMutate(values, {
        onSuccess: (conversation) => {
          setActiveId(conversation.id)
          setGroupOpen(false)
          setQuery('')
          setDraft('')
        },
      })
    },
    [createGroupMutate],
  )

  const leaveMutate = leave.mutate
  const handleLeave = useCallback(() => {
    if (activeId === null) return
    leaveMutate(activeId, { onSuccess: () => setActiveId(null) })
  }, [activeId, leaveMutate])

  const openGroupForm = useCallback(() => setGroupOpen(true), [])
  const closeGroupForm = useCallback(() => setGroupOpen(false), [])

  const sendMutate = send.mutate
  const handleDraftChange = useCallback(
    (value: string) => {
      setDraft(value)
      if (activeId !== null && value.length > 0) socketClient.notifyTyping(activeId)
    },
    [activeId],
  )

  const handleSend = useCallback(() => {
    if (activeId === null) return
    sendMutate({ conversationId: activeId, body: draft.trim() }, { onSuccess: () => setDraft('') })
  }, [activeId, draft, sendMutate])

  return (
    <div style={root} testId="chat__layout">
      <ChatSidebar
        conversations={items}
        companions={found}
        query={query}
        activeId={activeId}
        onQueryChange={setQuery}
        onSelect={handleSelect}
        onOpenCompanion={handleOpenCompanion}
        online={online}
        onCreateGroup={openGroupForm}
      />
      <div style={pane}>
        <If condition={conversations.isPending} fallback={
          <If
            condition={conversations.isError}
            fallback={
              <>
                <ChatThread
                  conversation={active}
                  messages={history.data ?? []}
                  members={members.data ?? []}
                  currentUserId={currentUserId}
                  loading={history.isPending && activeId !== null}
                  typingName={typingName}
                  onLeave={handleLeave}
                />
                <If condition={active !== null}>
                  <ChatComposer
                    value={draft}
                    disabled={activeId === null}
                    pending={send.isPending}
                    error={send.error?.message}
                    onChange={handleDraftChange}
                    onSend={handleSend}
                  />
                </If>
              </>
            }
          >
            <ErrorState details={conversations.error?.message ?? ''} onRetry={handleRetry} />
          </If>
        }>
          <Spinner />
        </If>
      </div>
      <ChatGroupForm
        open={groupOpen}
        companions={colleagues}
        pending={createGroup.isPending}
        error={createGroup.error?.message}
        onSubmit={handleCreateGroup}
        onClose={closeGroupForm}
      />
    </div>
  )
}
