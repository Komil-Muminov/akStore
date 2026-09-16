import { Fragment } from 'react'
import { dayLabelOf, isDayStart, isGroup, type IConversation } from '@/entities/message'
import { If, Spinner } from '@/shared/ui'
import {
  ESTIMATED_MESSAGE_HEIGHT,
  PLACEHOLDER_HINT,
  PLACEHOLDER_TITLE,
  THREAD_EMPTY_HINT,
  THREAD_EMPTY_TITLE,
  type IProps,
} from './model'
import { list, root } from './style'
import { Bubble } from './ui/Bubble'
import { DayChip } from './ui/DayChip'
import { Placeholder } from './ui/Placeholder'
import { ThreadHead } from './ui/ThreadHead'

export const ChatThread = ({ conversation, messages, members, currentUserId, loading, onLeave }: IProps) => (
  <div style={root} testId="chat__thread">
    <If
      condition={conversation !== null}
      fallback={<Placeholder title={PLACEHOLDER_TITLE} hint={PLACEHOLDER_HINT} />}
    >
      {() => (
        <>
          <ThreadHead conversation={conversation as IConversation} members={members} onLeave={onLeave} />
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
                  {messages.map((message, index) => (
                    <Fragment key={message.id}>
                      <If condition={isDayStart(message, messages[index - 1])}>
                        <DayChip label={dayLabelOf(message.createdAt)} />
                      </If>
                      <Bubble
                        message={message}
                        own={message.authorId === currentUserId}
                        showAuthor={isGroup(conversation as IConversation) && message.authorId !== currentUserId}
                      />
                    </Fragment>
                  ))}
                </virtual-list>
              </If>
            }
          >
            <Spinner />
          </If>
        </>
      )}
    </If>
  </div>
)
