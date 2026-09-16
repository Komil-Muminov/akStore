import { timeOf, type IMessage } from '@/entities/message'
import { theme } from '@/shared/config'
import { Icon, If } from '@/shared/ui'
import { authorLabel, bodyOf, bubbleOf, metaOf, metaRow, rowOf } from '../style'

interface IProps {
  message: IMessage
  own: boolean
  showAuthor: boolean
  read: boolean
  showStatus: boolean
}

export const Bubble = ({ message, own, showAuthor, read, showStatus }: IProps) => (
  <div style={rowOf(own)} testId={`chat__message-${message.id}`}>
    <div style={bubbleOf(own)}>
      <If condition={showAuthor}>
        <text style={authorLabel}>{message.authorName}</text>
      </If>
      <text style={bodyOf(own)}>{message.body}</text>
      <div style={metaRow}>
        <text style={metaOf(own)}>{timeOf(message.createdAt)}</text>
        <If condition={showStatus}>
          <Icon
            name={read ? 'checkCheck' : 'check'}
            size={theme.size.iconSm}
            color={theme.colors.onAccent}
          />
        </If>
      </div>
    </div>
  </div>
)
