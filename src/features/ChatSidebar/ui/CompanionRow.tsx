import { useCallback } from 'react'
import type { IColleague } from '@/entities/message'
import { avatar, avatarText, name, preview, row, rowBody, rowTop } from '../style'
import { initialsOf } from '@/shared/lib'

interface IProps {
  companion: IColleague
  onOpen: (companionId: string) => void
}

export const CompanionRow = ({ companion, onOpen }: IProps) => {
  const handleClick = useCallback(() => onOpen(companion.userId), [companion.userId, onOpen])

  return (
    <div style={row(false)} onClick={handleClick} testId={`chat__companion-${companion.userId}`}>
      <div style={avatar(false)}>
        <text style={avatarText(false)}>{initialsOf(companion.fullName || companion.login)}</text>
      </div>
      <div style={rowBody}>
        <div style={rowTop}>
          <text style={name}>{companion.fullName || companion.login}</text>
        </div>
        <text style={preview}>{companion.positionName}</text>
      </div>
    </div>
  )
}
