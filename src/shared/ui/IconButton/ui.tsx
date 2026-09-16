import { theme } from '@/shared/config'
import { Icon, type TIconName } from '../Icon'
import { root } from './style'

interface IProps {
  icon: TIconName
  onClick?: () => void
  testId?: string
  color?: string
}

export const IconButton = ({ icon, onClick, testId, color = theme.colors.tertiary }: IProps) => (
  <div testId={testId} onClick={onClick} style={root}>
    <Icon name={icon} color={color} />
  </div>
)
