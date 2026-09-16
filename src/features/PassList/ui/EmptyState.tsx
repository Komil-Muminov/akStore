import { theme } from '@/shared/config'
import { Icon, Text, type TIconName } from '@/shared/ui'
import { empty, emptyMark } from '../style'

interface IProps {
  icon: TIconName
  title: string
  text: string
}

export const EmptyState = ({ icon, title, text }: IProps) => (
  <div style={empty} testId="pass-list__empty">
    <div style={emptyMark}>
      <Icon name={icon} size={theme.size.iconXl} color={theme.colors.tertiary} />
    </div>
    <Text variant="title">{title}</Text>
    <Text variant="secondary">{text}</Text>
  </div>
)
