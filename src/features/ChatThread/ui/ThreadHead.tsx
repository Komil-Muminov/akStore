import { initialsOf } from '@/entities/pass'
import type { IConversation } from '@/entities/message'
import { Text } from '@/shared/ui'
import { COMPANION_HINT } from '../model'
import { head, headAvatar, headAvatarText, headText } from '../style'

interface IProps {
  conversation: IConversation
}

export const ThreadHead = ({ conversation }: IProps) => (
  <div style={head} testId="chat__thread-head">
    <div style={headAvatar}>
      <text style={headAvatarText}>{initialsOf(conversation.companionName || conversation.companionLogin)}</text>
    </div>
    <div style={headText}>
      <Text variant="bodyStrong">{conversation.companionName || conversation.companionLogin}</Text>
      <Text variant="caption">{COMPANION_HINT}</Text>
    </div>
  </div>
)
