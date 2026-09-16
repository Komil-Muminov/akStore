import { theme } from '@/shared/config'
import { ICONS, type TIconName } from './model'

interface IProps {
  name: TIconName
  color: string
  size?: number
}

export const Icon = ({ name, color, size = theme.size.iconMd }: IProps) => (
  <svg source={ICONS[name]} style={{ width: size, height: size, flexShrink: 0, color }} />
)
