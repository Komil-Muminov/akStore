import { Text } from '@/shared/ui'
import { dayChip, daySeparator } from '../style'

interface IProps {
  label: string
}

export const DayChip = ({ label }: IProps) => (
  <div style={daySeparator}>
    <div style={dayChip}>
      <Text variant="caption">{label}</Text>
    </div>
  </div>
)
