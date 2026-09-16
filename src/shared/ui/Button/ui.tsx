import { Text } from '../Text'
import { root } from './style'

interface IProps {
  label: string
  onClick: () => void
  disabled?: boolean
  testId?: string
}

export const Button = ({ label, onClick, disabled = false, testId }: IProps) => (
  <div testId={testId} onClick={disabled ? undefined : onClick} style={root(disabled)}>
    <Text variant="onAccent">{label}</Text>
  </div>
)
