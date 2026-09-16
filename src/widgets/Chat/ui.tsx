import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChatComposer } from '@/features/ChatComposer'
import { ChatSidebar } from '@/features/ChatSidebar'
import { ChatThread } from '@/features/ChatThread'
import { If, Spinner } from '@/shared/ui'
import { useSession } from '@/shared/lib'
import { useChatMutations, useChatSocket, useCompanionsQuery, useConversationsQuery, useHistoryQuery } from './hooks'
import { filterCompanions } from './lib'
import { pane, root } from './style'
import { ErrorState } from './ui/ErrorState'

export const Chat = () => {
  const currentUserId = useSession()?.user.id ?? ''
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const conversations = useConversationsQuery()
  const companions = useCompanionsQuery()
  const history = useHistoryQuery(activeId)
  const { open, send, read } = useChatMutations()
  useChatSocket()

  const items = useMemo(() => conversations.data ?? [], [conversations.data])
  const active = useMemo(() => items.find((item) => item.id === activeId) ?? null, [items, activeId])
  const found = useMemo(
    () => filterCompanions(companions.data ?? [], query, currentUserId),
    [companions.data, query, currentUserId],
  )

  const readMutate = read.mutate
  useEffect(() => {
    if (activeId !== null) readMutate(activeId)
  }, [activeId, readMutate])

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

  const sendMutate = send.mutate
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
                  currentUserId={currentUserId}
                  loading={history.isPending && activeId !== null}
                />
                <If condition={active !== null}>
                  <ChatComposer
                    value={draft}
                    disabled={activeId === null}
                    pending={send.isPending}
                    error={send.error?.message}
                    onChange={setDraft}
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
    </div>
  )
}
