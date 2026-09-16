import { theme } from '@/shared/config'
import { Icon, Text } from '@/shared/ui'
import { empty, emptyHint } from '../style'

interface IProps {
  title: string
  hint: string
}

export const EmptyState = ({ title, hint }: IProps) => (
  <div style={empty} testId="chat__sidebar-empty">
    <Icon name="inbox" size={theme.size.iconXl} color={theme.colors.ghost} />
    <Text variant="bodyStrong">{title}</Text>
    <Text variant="caption" style={emptyHint}>{hint}</Text>
  </div>
)
