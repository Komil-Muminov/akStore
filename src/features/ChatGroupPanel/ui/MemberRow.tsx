import { useCallback } from 'react'
import type { IMember } from '@/entities/message'
import { theme } from '@/shared/config'
import { IconButton, If, Text, Tooltip } from '@/shared/ui'
import { OWNER_MARK, REMOVE_TOOLTIP } from '../model'
import { memberName, memberRow } from '../style'

interface IProps {
  member: IMember
  isOwner: boolean
  canRemove: boolean
  onRemove: (memberId: string) => void
}

export const MemberRow = ({ member, isOwner, canRemove, onRemove }: IProps) => {
  const handleRemove = useCallback(() => onRemove(member.userId), [member.userId, onRemove])

  return (
    <div style={memberRow} testId={`chat__group-member-${member.userId}`}>
      <text style={memberName}>{member.fullName || member.login}</text>
      <If condition={isOwner}>
        <Text variant="caption">{OWNER_MARK}</Text>
      </If>
      <If condition={canRemove}>
        <Tooltip title={REMOVE_TOOLTIP}>
          <IconButton
            icon="x"
            onClick={handleRemove}
            hoverColor={theme.colors.dangerSoft}
            testId={`chat__kick-${member.userId}`}
          />
        </Tooltip>
      </If>
    </div>
  )
}
