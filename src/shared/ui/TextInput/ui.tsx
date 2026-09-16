import { input, inputTheme } from './style'

interface IProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  autoFocus?: boolean
  testId?: string
}

export const TextInput = ({ value, onChange, onSubmit, placeholder, autoFocus, testId }: IProps) => (
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
)
