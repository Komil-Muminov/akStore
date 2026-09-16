import { memo, useCallback } from 'react'
import { PassFilter } from '@/entities/pass'
import { theme } from '@/shared/config'
import { Icon, Text, type TIconName } from '@/shared/ui'
import { tab, tabCount, tabLabel, tabs } from '../style'

interface ITab {
  id: PassFilter
  label: string
  icon: TIconName
}

const TABS: ITab[] = [
  { id: PassFilter.ALL, label: 'Все', icon: 'listChecks' },
  { id: PassFilter.ACTIVE, label: 'Активные', icon: 'shieldCheck' },
  { id: PassFilter.REVOKED, label: 'Отозванные', icon: 'shieldOff' },
]

interface ITabProps {
  entry: ITab
  active: boolean
  total: number
  onSelect: (filter: PassFilter) => void
}

const Tab = memo(({ entry, active, total, onSelect }: ITabProps) => {
  const handleClick = useCallback(() => onSelect(entry.id), [onSelect, entry.id])
  return (
    <div testId={`passes__tab-${entry.id}`} onClick={handleClick} style={tab(active)}>
      <Icon name={entry.icon} size={theme.size.iconSm + 2} color={active ? theme.colors.accent : theme.colors.secondary} />
      <Text variant="bodyStrong" style={tabLabel(active)}>{entry.label}</Text>
      <text style={tabCount(active)}>{String(total)}</text>
    </div>
  )
})

interface IProps {
  active: PassFilter
  counts: Record<PassFilter, number>
  onSelect: (filter: PassFilter) => void
}

export const FilterTabs = ({ active, counts, onSelect }: IProps) => (
  <div style={tabs}>
    {TABS.map((entry) => (
      <Tab key={entry.id} entry={entry} active={entry.id === active} total={counts[entry.id]} onSelect={onSelect} />
    ))}
  </div>
)
