import type { EventPayload, StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'
import { Icon, type TIconName } from '../Icon'
import { If } from '../If'
import { input, inputTheme, root } from './style'

interface IProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  onKeyDown?: (event: EventPayload) => void
  placeholder?: string
  icon?: TIconName
  autoFocus?: boolean
  tabIndex?: number
  testId?: string
  style?: StyleDesc
}

export const TextInput = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder,
  icon,
  autoFocus,
  tabIndex = 0,
  testId,
  style: customStyle,
}: IProps) => (
  <div style={customStyle ? { ...root, ...customStyle } : root}>
    <If condition={icon !== undefined}>
      <Icon name={icon ?? 'search'} size={theme.size.iconMd} color={theme.colors.tertiary} />
    </If>
    <input
      testId={testId}
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      onChange={(event) => onChange(event.value ?? '')}
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      theme={inputTheme}
      style={input}
    />
  </div>
)

