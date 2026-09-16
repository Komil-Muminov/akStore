import { If, Text, TextInput } from '@/shared/ui'
import {
  COMPANIONS_SECTION,
  DIALOGS_SECTION,
  EMPTY_HINT,
  EMPTY_TITLE,
  NOT_FOUND_HINT,
  NOT_FOUND_TITLE,
  SEARCH_PLACEHOLDER,
  SIDEBAR_TITLE,
  type IProps,
} from './model'
import { head, list, root, sectionLabel } from './style'
import { CompanionRow } from './ui/CompanionRow'
import { ConversationRow } from './ui/ConversationRow'
import { EmptyState } from './ui/EmptyState'

export const ChatSidebar = ({
  conversations,
  companions,
  query,
  activeId,
  onQueryChange,
  onSelect,
  onOpenCompanion,
}: IProps) => {
  const searching = query.trim().length > 0

  return (
    <div style={root} testId="chat__sidebar">
      <div style={head}>
        <Text variant="title">{SIDEBAR_TITLE}</Text>
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
                    onSelect={onSelect}
                  />
                ))}
              </>
            </If>
          }
        >
          <If
            condition={companions.length > 0}
            fallback={<EmptyState title={NOT_FOUND_TITLE} hint={NOT_FOUND_HINT} />}
          >
            <>
              <Text variant="label" style={sectionLabel}>
                {COMPANIONS_SECTION}
              </Text>
              {companions.map((companion) => (
                <CompanionRow key={companion.userId} companion={companion} onOpen={onOpenCompanion} />
              ))}
            </>
          </If>
        </If>
      </div>
    </div>
  )
}
