import { theme } from '@/shared/config'
import { Icon, type TIconName } from '../Icon'
import { If } from '../If'
import type { TButtonVariant } from './model'
import { iconColor, label, root } from './style'

interface IProps {
  label: string
  onClick: () => void
  variant?: TButtonVariant
  icon?: TIconName
  disabled?: boolean
  testId?: string
}

export const Button = ({ label: text, onClick, variant = 'primary', icon, disabled = false, testId }: IProps) => (
  <div testId={testId} onClick={disabled ? undefined : onClick} style={root(variant, disabled)}>
    <If condition={icon !== undefined}>
      <Icon name={icon ?? 'plus'} size={theme.size.iconMd} color={iconColor(variant)} />
    </If>
    <text style={label(variant)}>{text}</text>
  </div>
)
