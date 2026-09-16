import { theme } from '@/shared/config'
import { Icon, Text } from '@/shared/ui'
import { placeholder, placeholderMark } from '../style'

interface IProps {
  title: string
  hint: string
}

export const Placeholder = ({ title, hint }: IProps) => (
  <div style={placeholder} testId="chat__placeholder">
    <div style={placeholderMark}>
      <Icon name="message" size={theme.size.iconXl} color={theme.colors.accent} />
    </div>
    <Text variant="title">{title}</Text>
    <Text variant="secondary">{hint}</Text>
  </div>
)
