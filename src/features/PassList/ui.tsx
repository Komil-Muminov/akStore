import { theme } from '@/shared/config'
import { Icon, If, Text } from '@/shared/ui'
import { EMPTY_LABEL, type IProps } from './model'
import { empty, list } from './style'
import { PassRow } from './ui/PassRow'

const ESTIMATED_ROW_HEIGHT = theme.size.row + theme.spacing.xs

export const PassList = ({ passes, onDeactivate }: IProps) => (
  <If
    condition={passes.length > 0}
    fallback={
      <div style={empty} testId="pass-list__empty">
        <Icon name="sparkle" size={theme.size.iconLg} color={theme.colors.ghost} />
        <Text variant="secondary">{EMPTY_LABEL}</Text>
      </div>
    }
  >
    <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list}>
      {passes.map((pass) => (
        <div key={pass.id}>
          <PassRow pass={pass} onDeactivate={onDeactivate} />
        </div>
      ))}
    </virtual-list>
  </If>
)
