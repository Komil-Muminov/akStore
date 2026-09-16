import { theme } from '@/shared/config'
import { Icon } from '../Icon'
import { If } from '../If'
import { Text } from '../Text'
import { box, root } from './style'

interface IProps {
  label: string
  checked: boolean
  onToggle: () => void
  hint?: string
  testId?: string
}

export const Checkbox = ({ label, checked, onToggle, hint, testId }: IProps) => (
  <div style={root} onClick={onToggle} testId={testId}>
    <div style={box(checked)}>
      <If condition={checked}>
        <Icon name="check" size={theme.size.iconSm} color={theme.colors.onAccent} />
      </If>
    </div>
    <Text variant="body" style={{ flexGrow: 1 }}>{label}</Text>
    <If condition={hint !== undefined}>
      <Text variant="caption">{hint ?? ''}</Text>
    </If>
  </div>
)
