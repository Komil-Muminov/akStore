import { theme } from '@/shared/config'
import { Icon, type TIconName } from '../Icon'
import { root } from './style'

interface IProps {
  icon: TIconName
  onClick?: () => void
  testId?: string
  color?: string
  hoverColor?: string
  variant?: 'ghost' | 'outline'
}

export const IconButton = ({
  icon,
  onClick,
  testId,
  color = theme.colors.secondary,
  hoverColor = theme.colors.overlayStrong,
  variant = 'ghost',
}: IProps) => (
  <div testId={testId} onClick={onClick} style={root(hoverColor, variant)}>
    <Icon name={icon} size={theme.size.iconMd} color={color} />
  </div>
)
