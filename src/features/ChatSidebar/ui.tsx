import { IconButton, If, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  COMPANIONS_SECTION,
  CREATE_GROUP_TOOLTIP,
  MESSAGES_SECTION,
  DIALOGS_SECTION,
  EMPTY_HINT,
  EMPTY_TITLE,
  NOT_FOUND_HINT,
  NOT_FOUND_TITLE,
  SEARCH_PLACEHOLDER,
  SIDEBAR_TITLE,
  type IProps,
} from './model'
import { head, headTop, list, root, sectionLabel } from './style'
import { CompanionRow } from './ui/CompanionRow'
import { MessageHit } from './ui/MessageHit'
import { ConversationRow } from './ui/ConversationRow'
import { EmptyState } from './ui/EmptyState'

export const ChatSidebar = ({
  conversations,
  companions,
  online,
  hits,
  query,
  activeId,
  onQueryChange,
  onSelect,
  onOpenCompanion,
  onCreateGroup,
}: IProps) => {
  const searching = query.trim().length > 0

  return (
    <div style={root} testId="chat__sidebar">
      <div style={head}>
        <div style={headTop}>
          <Text variant="title">{SIDEBAR_TITLE}</Text>
          <Tooltip title={CREATE_GROUP_TOOLTIP}>
            <IconButton icon="users" onClick={onCreateGroup} testId="chat__create-group" />
          </Tooltip>
        </div>
        <TextInput
          value={query}
          onChange={onQueryChange}
          placeholder={SEARCH_PLACEHOLDER}
          icon="search"
          testId="chat__search"
        />
      </div>
      <div style={list}>
        <If
          condition={searching}
          fallback={
            <If
              condition={conversations.length > 0}
              fallback={<EmptyState title={EMPTY_TITLE} hint={EMPTY_HINT} />}
            >
              <>
                <Text variant="label" style={sectionLabel}>
                  {DIALOGS_SECTION}
                </Text>
                {conversations.map((conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                    active={conversation.id === activeId}
                    online={online.includes(conversation.companionId)}
                    onSelect={onSelect}
                  />
                ))}
              </>
            </If>
          }
        >
          <If
            condition={companions.length > 0 || hits.length > 0}
            fallback={<EmptyState title={NOT_FOUND_TITLE} hint={NOT_FOUND_HINT} />}
          >
            <>
              <If condition={companions.length > 0}>
                <>
                  <Text variant="label" style={sectionLabel}>
                    {COMPANIONS_SECTION}
                  </Text>
                  {companions.map((companion) => (
                    <CompanionRow key={companion.userId} companion={companion} onOpen={onOpenCompanion} />
                  ))}
                </>
              </If>
              <If condition={hits.length > 0}>
                <>
                  <Text variant="label" style={sectionLabel}>
                    {MESSAGES_SECTION}
                  </Text>
                  {hits.map((message) => (
                    <MessageHit key={message.id} message={message} onOpen={onSelect} />
                  ))}
                </>
              </If>
            </>
          </If>
        </If>
      </div>
    </div>
  )
}
