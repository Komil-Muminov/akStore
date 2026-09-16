import { memo, useCallback } from 'react'
import type { PassFilter } from '@/entities/pass'
import { theme } from '@/shared/config'
import { Icon, Text } from '@/shared/ui'
import type { INavItem } from '../model'
import { count, countText, item, itemText } from '../style'

interface IProps {
  entry: INavItem
  active: boolean
  total: number
  onSelect: (filter: PassFilter) => void
}

export const NavItem = memo(({ entry, active, total, onSelect }: IProps) => {
  const handleClick = useCallback(() => onSelect(entry.id), [onSelect, entry.id])

  return (
    <div testId={`sidebar__item-${entry.id}`} onClick={handleClick} style={item(active)}>
      <Icon name={entry.icon} size={theme.size.iconMd} color={active ? theme.colors.accent : theme.colors.secondary} />
      <div style={itemText}>
        <Text variant={active ? 'bodyStrong' : 'body'}>{entry.label}</Text>
        <Text variant="caption">{entry.hint}</Text>
      </div>
      <div style={count(active)}>
        <text style={countText(active)}>{String(total)}</text>
      </div>
    </div>
  )
})
