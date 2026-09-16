import { timeOf, type IMessage } from '@/entities/message'
import { bodyOf, bubbleOf, metaOf, rowOf } from '../style'

interface IProps {
  message: IMessage
  own: boolean
}

export const Bubble = ({ message, own }: IProps) => (
  <div style={rowOf(own)} testId={`chat__message-${message.id}`}>
    <div style={bubbleOf(own)}>
      <text style={bodyOf(own)}>{message.body}</text>
      <text style={metaOf(own)}>{timeOf(message.createdAt)}</text>
    </div>
  </div>
)
