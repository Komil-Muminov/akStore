import { useCallback } from 'react'
import type { IHost } from '@/entities/host'
import { Checkbox } from '@/shared/ui'
import { item } from '../style'

interface IProps {
  companion: IHost
  checked: boolean
  onToggle: (userId: string) => void
}

export const MemberItem = ({ companion, checked, onToggle }: IProps) => {
  const handleToggle = useCallback(() => onToggle(companion.userId), [companion.userId, onToggle])

  return (
    <div style={item}>
      <Checkbox
        label={companion.fullName || companion.login}
        hint={companion.positionName}
        checked={checked}
        onToggle={handleToggle}
        testId={`chat__member-${companion.userId}`}
      />
    </div>
  )
}
