import { theme } from '@/shared/config'
import { Icon, type TIconName } from '../Icon'
import { If } from '../If'
import type { TButtonVariant } from './model'
import { iconColor, label, root } from './style'

interface IProps {
  label: string
  onClick: () => void
  variant?: TButtonVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: TIconName
  disabled?: boolean
  fullWidth?: boolean
  testId?: string
}

export const Button = ({
  label: text,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  fullWidth = false,
  testId,
}: IProps) => (
  <div testId={testId} onClick={disabled ? undefined : onClick} style={root(variant, disabled, fullWidth, size)}>
    <If condition={icon !== undefined}>
      <Icon name={icon ?? 'plus'} size={size === 'lg' ? theme.size.iconLg : theme.size.iconMd} color={iconColor(variant)} />
    </If>
    <text style={label(variant, size)}>{text}</text>
  </div>
)
