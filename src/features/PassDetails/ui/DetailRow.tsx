import { theme } from '@/shared/config'
import { Icon, Text, type TIconName } from '@/shared/ui'
import { EMPTY_VALUE } from '../model'
import { detailRow, detailText } from '../style'

interface IProps {
  icon: TIconName
  label: string
  value: string
}

export const DetailRow = ({ icon, label, value }: IProps) => (
  <div style={detailRow}>
    <Icon name={icon} size={theme.size.iconMd} color={theme.colors.tertiary} />
    <div style={detailText}>
      <Text variant="label">{label}</Text>
      <Text variant={value ? 'body' : 'ghost'}>{value || EMPTY_VALUE}</Text>
    </div>
  </div>
)
