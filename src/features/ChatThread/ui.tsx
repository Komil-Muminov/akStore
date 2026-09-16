import { Fragment, useCallback } from 'react'
import type { EventPayload } from '@gpuix/react'
import {
  dayLabelOf,
  UPLOAD_HINT,
  isDayStart,
  isGroup,
  isReadByCompanion,
  TYPING_HINT,
  type IConversation,
} from '@/entities/message'
import { Button, If, Spinner, Text } from '@/shared/ui'
import {
  ESTIMATED_MESSAGE_HEIGHT,
  LOAD_OLDER_LABEL,
  PLACEHOLDER_HINT,
  PLACEHOLDER_TITLE,
  THREAD_EMPTY_HINT,
  THREAD_EMPTY_TITLE,
  type IProps,
} from './model'
import { list, loadOlderRow, root, typingRow, typingText } from './style'
import { dropOverlay } from './style.file'
import { Bubble } from './ui/Bubble'
import { DayChip } from './ui/DayChip'
import { Placeholder } from './ui/Placeholder'
import { ThreadHead } from './ui/ThreadHead'

export const ChatThread = ({
  conversation,
  messages,
  members,
  currentUserId,
  loading,
  typingName,
  hasMore,
  onLoadOlder,
  onLeave,
  onManage,
  onEditMessage,
  onRemoveMessage,
  onDownload,
  onDropFiles,
  dropHint,
}: IProps) => {
  const handleDrop = useCallback((event: EventPayload) => onDropFiles(event.paths ?? []), [onDropFiles])

  return (
    <div style={root} testId="chat__thread" onFileDrop={handleDrop}>
      <If
        condition={conversation !== null}
        fallback={<Placeholder title={PLACEHOLDER_TITLE} hint={PLACEHOLDER_HINT} />}
      >
        {() => (
          <>
            <ThreadHead
              conversation={conversation as IConversation}
              members={members}
              onLeave={onLeave}
              onManage={onManage}
            />
            <If
              condition={loading}
              fallback={
                <If
                  condition={messages.length > 0}
                  fallback={<Placeholder title={THREAD_EMPTY_TITLE} hint={THREAD_EMPTY_HINT} />}
                >
                  <virtual-list
                    estimatedItemHeight={ESTIMATED_MESSAGE_HEIGHT}
                    alignment="bottom"
                    followTail
                    style={list}
                    testId="chat__messages"
                  >
                    <If condition={hasMore}>
                      <div style={loadOlderRow}>
                        <Button
                          label={LOAD_OLDER_LABEL}
                          variant="secondary"
                          size="sm"
                          icon="rotate"
                          onClick={onLoadOlder}
                          testId="chat__load-older"
                        />
                      </div>
                    </If>
                    {messages.map((message, index) => (
                      <Fragment key={message.id}>
                        <If condition={isDayStart(message, messages[index - 1])}>
                          <DayChip label={dayLabelOf(message.createdAt)} />
                        </If>
                        <Bubble
                          message={message}
                          own={message.authorId === currentUserId}
                          showAuthor={isGroup(conversation as IConversation) && message.authorId !== currentUserId}
                          read={isReadByCompanion(message, conversation as IConversation)}
                          showStatus={
                            message.authorId === currentUserId && !isGroup(conversation as IConversation)
                          }
                          onEdit={onEditMessage}
                          onRemove={onRemoveMessage}
                          onDownload={onDownload}
                        />
                      </Fragment>
                    ))}
                  </virtual-list>
                </If>
              }
            >
              <Spinner />
            </If>
            <If condition={dropHint}>
              <div style={dropOverlay} testId="chat__drop">
                <Text variant="title">{UPLOAD_HINT}</Text>
              </div>
            </If>
            <If condition={typingName.length > 0}>
              <div style={typingRow} testId="chat__typing">
                <text style={typingText}>{`${typingName} ${TYPING_HINT}`}</text>
              </div>
            </If>
          </>
        )}
      </If>
    </div>
  )
}
