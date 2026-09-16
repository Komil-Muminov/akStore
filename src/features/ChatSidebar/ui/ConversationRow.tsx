import { useCallback } from 'react'
import { initialsOf } from '@/entities/pass'
import { isGroup, previewOf, timeOf, titleOf, unreadLabelOf, type IConversation } from '@/entities/message'
import { theme } from '@/shared/config'
import { Icon, If, Text } from '@/shared/ui'
import { avatar, avatarText, avatarWrap, badge, badgeText, name, onlineDot, preview, row, rowBody, rowTop } from '../style'

interface IProps {
  conversation: IConversation
  active: boolean
  online: boolean
  onSelect: (conversationId: string) => void
}

export const ConversationRow = ({ conversation, active, online, onSelect }: IProps) => {
  const handleClick = useCallback(() => onSelect(conversation.id), [conversation.id, onSelect])
  const group = isGroup(conversation)

  return (
    <div style={row(active)} onClick={handleClick} testId={`chat__dialog-${conversation.id}`}>
      <div style={avatarWrap}>
        <div style={avatar(active)}>
          <If
            condition={group}
            fallback={<text style={avatarText(active)}>{initialsOf(titleOf(conversation))}</text>}
          >
            <Icon
              name="users"
              size={theme.size.iconMd}
              color={active ? theme.colors.accent : theme.colors.secondary}
            />
          </If>
        </div>
        <If condition={online && !group}>
          <div style={onlineDot} testId={`chat__online-${conversation.companionId}`} />
        </If>
      </div>
      <div style={rowBody}>
        <div style={rowTop}>
          <text style={name}>{titleOf(conversation)}</text>
          <If condition={conversation.lastMessageAt !== null}>
            {() => <Text variant="caption">{timeOf(conversation.lastMessageAt as string)}</Text>}
          </If>
        </div>
        <div style={rowTop}>
          <text style={preview}>{previewOf(conversation)}</text>
          <If condition={conversation.unreadCount > 0}>
            <div style={badge}>
              <text style={badgeText}>{unreadLabelOf(conversation.unreadCount)}</text>
            </div>
          </If>
        </div>
      </div>
    </div>
  )
}
