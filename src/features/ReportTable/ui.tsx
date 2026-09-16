import { theme } from '@/shared/config'
import { Icon, If, Text } from '@/shared/ui'
import { COUNT_SUFFIX, EMPTY, ESTIMATED_ROW_HEIGHT, TITLE, type IProps } from './model'
import { empty, head, list, root, rowWrapper } from './style'
import { ReportRow } from './ui/ReportRow'

export const ReportTable = ({ passes }: IProps) => (
  <div style={root} testId="report-table">
    <div style={head}>
      <Icon name="listChecks" size={theme.size.iconMd} color={theme.colors.tertiary} />
      <Text variant="label">{`${TITLE.toUpperCase()} · ${passes.length}${COUNT_SUFFIX}`}</Text>
    </div>
    <If
      condition={passes.length > 0}
      fallback={
        <div style={{ ...list, ...empty }}>
          <Text variant="ghost">{EMPTY}</Text>
        </div>
      }
    >
      <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="report-table__list">
        {passes.map((pass) => (
          <div key={pass.id} style={rowWrapper}>
            <ReportRow pass={pass} />
          </div>
        ))}
      </virtual-list>
    </If>
  </div>
)
