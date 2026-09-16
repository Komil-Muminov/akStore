import { theme } from '@/shared/config'
import { Icon, type TIconName } from '../Icon'
import { If } from '../If'
import { input, inputTheme, root } from './style'

interface IProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  icon?: TIconName
  autoFocus?: boolean
  testId?: string
}

export const TextInput = ({ value, onChange, onSubmit, placeholder, icon, autoFocus, testId }: IProps) => (
  <div style={root}>
    <If condition={icon !== undefined}>
      <Icon name={icon ?? 'search'} size={theme.size.iconMd} color={theme.colors.tertiary} />
    </If>
    <input
      testId={testId}
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onChange={(event) => onChange(event.value ?? '')}
      onSubmit={onSubmit}
      theme={inputTheme}
      style={input}
    />
  </div>
)
