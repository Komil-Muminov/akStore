import { initialsOf } from '@/entities/pass'
import { isGroup, membersLabelOf, titleOf, type IConversation, type IMember } from '@/entities/message'
import { theme } from '@/shared/config'
import { Icon, IconButton, If, Text, Tooltip } from '@/shared/ui'
import { COMPANION_HINT, LEAVE_TOOLTIP, MANAGE_TOOLTIP, MEMBERS_SEPARATOR } from '../model'
import { head, headAvatar, headAvatarText, headText } from '../style'

interface IProps {
  conversation: IConversation
  members: IMember[]
  onLeave: () => void
  onManage: () => void
}

export const ThreadHead = ({ conversation, members, onLeave, onManage }: IProps) => {
  const group = isGroup(conversation)
  const names = members.map((member) => member.fullName || member.login).join(MEMBERS_SEPARATOR)

  return (
    <div style={head} testId="chat__thread-head">
      <div style={headAvatar}>
        <If
          condition={group}
          fallback={<text style={headAvatarText}>{initialsOf(titleOf(conversation))}</text>}
        >
          <Icon name="users" size={theme.size.iconMd} color={theme.colors.accent} />
        </If>
      </div>
      <div style={headText}>
        <Text variant="bodyStrong">{titleOf(conversation)}</Text>
        <If condition={group} fallback={<Text variant="caption">{COMPANION_HINT}</Text>}>
          <Tooltip title={names}>
            <Text variant="caption">{membersLabelOf(conversation.membersCount)}</Text>
          </Tooltip>
        </If>
      </div>
      <If condition={group}>
        <Tooltip title={MANAGE_TOOLTIP}>
          <IconButton icon="userCog" onClick={onManage} testId="chat__manage" />
        </Tooltip>
      </If>
      <If condition={group}>
        <Tooltip title={LEAVE_TOOLTIP}>
          <IconButton icon="logOut" onClick={onLeave} hoverColor={theme.colors.dangerSoft} testId="chat__leave" />
        </Tooltip>
      </If>
    </div>
  )
}
