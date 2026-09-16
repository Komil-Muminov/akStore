import { timeOf, type IMessage } from '@/entities/message'
import { If } from '@/shared/ui'
import { authorLabel, bodyOf, bubbleOf, metaOf, rowOf } from '../style'

interface IProps {
  message: IMessage
  own: boolean
  showAuthor: boolean
}

export const Bubble = ({ message, own, showAuthor }: IProps) => (
  <div style={rowOf(own)} testId={`chat__message-${message.id}`}>
    <div style={bubbleOf(own)}>
      <If condition={showAuthor}>
        <text style={authorLabel}>{message.authorName}</text>
      </If>
      <text style={bodyOf(own)}>{message.body}</text>
      <text style={metaOf(own)}>{timeOf(message.createdAt)}</text>
    </div>
  </div>
)
