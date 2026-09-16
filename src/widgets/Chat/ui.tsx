import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChatComposer } from '@/features/ChatComposer'
import { ChatSidebar } from '@/features/ChatSidebar'
import { ChatThread } from '@/features/ChatThread'
import { If, Spinner } from '@/shared/ui'
import { chatRequest, useChatRequest, useSession } from '@/shared/lib'
import { isGroup } from '@/entities/message'
import {
  useChatMutations,
  useCompanionsQuery,
  useConversationsQuery,
  useMembersQuery,
  useMessageSearchQuery,
  useOnlineQuery,
} from './hooks'
import { useHistoryPages } from './history'
import { useChatRealtime } from './realtime'
import { useMessageActions } from './actions'
import { useChatControls } from './controls'
import { useGroupPanel } from './group'
import { useAttachments } from './files'
import { ChatDialogs } from './ui/ChatDialogs'
import { filterCompanions } from './lib'
import { pane, root } from './style'
import { ErrorState } from './ui/ErrorState'

export const Chat = () => {
  const currentUserId = useSession()?.user.id ?? ''
  const [draft, setDraft] = useState('')
  const conversations = useConversationsQuery()
  const companions = useCompanionsQuery()
  const { open, send, read, createGroup, leave } = useChatMutations()
  const actions = useMessageActions(setDraft)
  const controls = useChatControls({ open, createGroup, leave, setDraft, cancelEdit: actions.cancelEdit })
  const { activeId, query } = controls
  const panel = useGroupPanel(activeId)
  const files = useAttachments(activeId)
  const onlineQuery = useOnlineQuery()
  const { online, setOnline, typingName } = useChatRealtime(activeId)

  const history = useHistoryPages(activeId)
  const hits = useMessageSearchQuery(query)
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

  const requestedCompanionId = useChatRequest()
  const openCompanion = controls.openCompanion
  useEffect(() => {
    if (requestedCompanionId === null) return
    openCompanion(requestedCompanionId)
    chatRequest.clear()
  }, [requestedCompanionId, openCompanion])

  const initialOnline = onlineQuery.data
  useEffect(() => {
    if (initialOnline) setOnline(initialOnline)
  }, [initialOnline, setOnline])

  const refetch = conversations.refetch
  const handleRetry = useCallback(() => void refetch(), [refetch])

  const sendMutate = send.mutate
  const submitEdit = actions.submitEdit
  const isEditing = actions.editing !== null
  const handleSend = useCallback(() => {
    if (activeId === null) return
    const body = draft.trim()
    if (isEditing) {
      submitEdit(body)
      return
    }
    sendMutate({ conversationId: activeId, body }, { onSuccess: () => setDraft('') })
  }, [activeId, draft, isEditing, sendMutate, submitEdit])

  return (
    <div style={root} testId="chat__layout">
      <ChatSidebar
        conversations={items}
        companions={found}
        query={query}
        activeId={activeId}
        onQueryChange={controls.setQuery}
        onSelect={controls.select}
        onOpenCompanion={controls.openCompanion}
        online={online}
        hits={hits.data ?? []}
        onCreateGroup={controls.openGroupForm}
      />
      <div style={pane}>
        <If condition={conversations.isPending} fallback={
          <If
            condition={conversations.isError}
            fallback={
              <>
                <ChatThread
                  conversation={active}
                  messages={history.messages}
                  members={members.data ?? []}
                  currentUserId={currentUserId}
                  loading={history.loading && activeId !== null}
                  hasMore={history.hasMore}
                  onLoadOlder={history.loadOlder}
                  typingName={typingName}
                  onLeave={controls.leaveGroup}
                  onManage={panel.show}
                  onEditMessage={actions.startEdit}
                  onRemoveMessage={actions.askRemove}
                  onDownload={files.handleDownload}
                  onDropFiles={files.sendFiles}
                  dropHint={files.pending}
                />
                <If condition={active !== null}>
                  <ChatComposer
                    value={draft}
                    disabled={activeId === null}
                    pending={send.isPending || actions.pending}
                    editing={isEditing}
                    error={send.error?.message ?? actions.error ?? files.error}
                    onChange={controls.changeDraft}
                    onSend={handleSend}
                    onCancelEdit={actions.cancelEdit}
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
      <ChatDialogs
        groupOpen={controls.groupOpen}
        colleagues={colleagues}
        groupPending={createGroup.isPending}
        groupError={createGroup.error?.message}
        removing={actions.removing}
        removePending={actions.pending}
        onCreateGroup={controls.submitGroup}
        onCloseGroup={controls.closeGroupForm}
        onConfirmRemove={actions.confirmRemove}
        onCancelRemove={actions.cancelRemove}
        panelOpen={panel.open}
        panelTitle={active?.title ?? ''}
        members={members.data ?? []}
        isOwner={active?.createdBy === currentUserId}
        panelPending={panel.pending}
        panelError={panel.error}
        onRename={panel.handleRename}
        onAddMembers={panel.handleAdd}
        onRemoveMember={panel.handleRemove}
        onClosePanel={panel.hide}
      />
    </div>
  )
}
