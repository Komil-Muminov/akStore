import { theme } from '@/shared/config'
import { Icon, Text } from '@/shared/ui'
import { APP_NAME, APP_TAGLINE, FOOTER_HINT, NAV_ITEMS, NAV_SECTION, type IProps } from './model'
import { brand, brandMark, brandText, footer, root, section, spacer } from './style'
import { NavItem } from './ui/NavItem'

export const Sidebar = ({ active, counts, onSelect }: IProps) => (
  <div style={root} testId="sidebar">
    <div style={brand}>
      <div style={brandMark}>
        <Icon name="shieldCheck" size={theme.size.iconLg} color={theme.colors.accent} />
      </div>
      <div style={brandText}>
        <Text variant="title">{APP_NAME}</Text>
        <Text variant="caption">{APP_TAGLINE}</Text>
      </div>
    </div>
    <div style={section}>
      <Text variant="label">{NAV_SECTION}</Text>
    </div>
    {NAV_ITEMS.map((entry) => (
      <NavItem key={entry.id} entry={entry} active={entry.id === active} total={counts[entry.id]} onSelect={onSelect} />
    ))}
    <div style={spacer} />
    <div style={footer}>
      <Icon name="sparkle" size={theme.size.iconSm} color={theme.colors.ghost} />
      <Text variant="caption">{FOOTER_HINT}</Text>
    </div>
  </div>
)
