import { memo, useCallback } from 'react'
import { unreadLabelOf } from '@/entities/message'
import type { AppRoutes } from '@/shared/config'
import { theme } from '@/shared/config'
import { Icon, If, Text } from '@/shared/ui'
import type { INavItem } from '../model'
import { item, itemBadge, itemBadgeText, itemText } from '../style'

interface IProps {
  entry: INavItem
  active: boolean
  badge: number
  onNavigate: (route: AppRoutes) => void
}

export const NavItem = memo(({ entry, active, badge, onNavigate }: IProps) => {
  const handleClick = useCallback(() => onNavigate(entry.id), [onNavigate, entry.id])

  return (
    <div testId={`nav__item-${entry.id}`} onClick={handleClick} style={item(active)}>
      <Icon name={entry.icon} size={theme.size.iconMd} color={active ? theme.colors.accent : theme.colors.secondary} />
      <div style={itemText}>
        <Text variant={active ? 'bodyStrong' : 'body'}>{entry.label}</Text>
        <Text variant="caption">{entry.hint}</Text>
      </div>
      <If condition={badge > 0}>
        <div style={itemBadge} testId={`nav__badge-${entry.id}`}>
          <text style={itemBadgeText}>{unreadLabelOf(badge)}</text>
        </div>
      </If>
    </div>
  )
})
