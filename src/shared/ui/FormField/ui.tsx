import type { EventPayload } from '@gpuix/react'
import type { TIconName } from '../Icon'
import { If } from '../If'
import { Text } from '../Text'
import { TextInput } from '../TextInput'
import { labelRow, message, required, root } from './style'

const REQUIRED_MARK = '*'

interface IProps {
  label: string
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  onKeyDown?: (event: EventPayload) => void
  placeholder?: string
  icon?: TIconName
  error?: string
  isRequired?: boolean
  autoFocus?: boolean
  tabIndex?: number
  testId?: string
}

export const FormField = ({
  label,
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder,
  icon,
  error,
  isRequired = false,
  autoFocus,
  tabIndex,
  testId,
}: IProps) => (
  <div style={root}>
    <div style={labelRow}>
      <Text variant="label">{label}</Text>
      <If condition={isRequired}>
        <text style={required}>{REQUIRED_MARK}</text>
      </If>
    </div>
    <TextInput
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      icon={icon}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      testId={testId}
    />
    <div style={message}>
      <If condition={error !== undefined}>
        <Text variant="danger">{error ?? ''}</Text>
      </If>
    </div>
  </div>
)
