import type { EventPayload, PublicInstance } from '@gpuix/react'
import { useCallback, type Ref } from 'react'
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
  tabIndex?: number
  testId?: string
  buttonRef?: Ref<PublicInstance>
  onKeyDown?: (event: EventPayload) => void
}

export const Button = ({
  label: text,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  fullWidth = false,
  tabIndex,
  testId,
  buttonRef,
  onKeyDown,
}: IProps) => {
  const handleKeyDown = useCallback(
    (event: EventPayload) => {
      const isActivate =
        event.key === 'enter' ||
        event.key === 'space' ||
        event.keyChar === ' ' ||
        event.keyChar === '\r'
      if (isActivate && !disabled) {
        onClick()
      }
      onKeyDown?.(event)
    },
    [disabled, onClick, onKeyDown],
  )

  return (
    <div
      ref={buttonRef}
      testId={testId}
      tabIndex={tabIndex}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      style={root(variant, disabled, fullWidth, size)}
    >
      <If condition={icon !== undefined}>
        <Icon name={icon ?? 'plus'} size={size === 'lg' ? theme.size.iconLg : theme.size.iconMd} color={iconColor(variant)} />
      </If>
      <text style={label(variant, size)}>{text}</text>
    </div>
  )
}
