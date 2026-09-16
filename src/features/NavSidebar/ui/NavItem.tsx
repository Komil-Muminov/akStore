import { memo, useCallback } from 'react'
import type { AppRoutes } from '@/shared/config'
import { theme } from '@/shared/config'
import { Icon, Text } from '@/shared/ui'
import type { INavItem } from '../model'
import { item, itemText } from '../style'

interface IProps {
  entry: INavItem
  active: boolean
  onNavigate: (route: AppRoutes) => void
}

export const NavItem = memo(({ entry, active, onNavigate }: IProps) => {
  const handleClick = useCallback(() => onNavigate(entry.id), [onNavigate, entry.id])

  return (
    <div testId={`nav__item-${entry.id}`} onClick={handleClick} style={item(active)}>
      <Icon name={entry.icon} size={theme.size.iconMd} color={active ? theme.colors.accent : theme.colors.secondary} />
      <div style={itemText}>
        <Text variant={active ? 'bodyStrong' : 'body'}>{entry.label}</Text>
        <Text variant="caption">{entry.hint}</Text>
      </div>
    </div>
  )
})
