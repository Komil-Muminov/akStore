import { useCallback } from 'react'
import { dayLabelOf, timeOf, type IMessage } from '@/entities/message'
import { theme } from '@/shared/config'
import { Icon, Text } from '@/shared/ui'
import { avatar, name, preview, row, rowBody, rowTop } from '../style'

interface IProps {
  message: IMessage
  onOpen: (conversationId: string) => void
}

export const MessageHit = ({ message, onOpen }: IProps) => {
  const handleClick = useCallback(() => onOpen(message.conversationId), [message.conversationId, onOpen])

  return (
    <div style={row(false)} onClick={handleClick} testId={`chat__hit-${message.id}`}>
      <div style={avatar(false)}>
        <Icon name="message" size={theme.size.iconMd} color={theme.colors.info} />
      </div>
      <div style={rowBody}>
        <div style={rowTop}>
          <text style={name}>{message.authorName}</text>
          <Text variant="caption">{`${dayLabelOf(message.createdAt)}, ${timeOf(message.createdAt)}`}</Text>
        </div>
        <text style={preview}>{message.body}</text>
      </div>
    </div>
  )
}
