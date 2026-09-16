import { useMemo } from 'react'
import { toShortDate } from '@/entities/report'
import { theme } from '@/shared/config'
import { Icon, If, Text, Tooltip } from '@/shared/ui'
import { EMPTY, MAX_BARS, MAX_LABELS, TITLE, TOOLTIP_ISSUED, TOOLTIP_REVOKED, type IProps } from './model'
import { bar, column, columnSlot, empty, head, labelCell, labels, plot, root } from './style'

export const ReportChart = ({ days }: IProps) => {
  const visible = useMemo(() => days.slice(-MAX_BARS), [days])
  const max = useMemo(() => visible.reduce((peak, day) => Math.max(peak, day.issued), 0), [visible])
  const labelEvery = Math.max(1, Math.ceil(visible.length / MAX_LABELS))

  return (
    <div style={root} testId="report-chart">
      <div style={head}>
        <Icon name="chart" size={theme.size.iconMd} color={theme.colors.tertiary} />
        <Text variant="label">{TITLE}</Text>
      </div>
      <If condition={visible.length > 0} fallback={<div style={empty}><Text variant="ghost">{EMPTY}</Text></div>}>
        <div style={plot}>
          {visible.map((day) => (
            <Tooltip key={day.date} title={`${toShortDate(day.date)}: ${day.issued} ${TOOLTIP_ISSUED}, ${day.revoked} ${TOOLTIP_REVOKED}`} style={columnSlot} asChild>
              <div style={column} testId={`report-chart__bar-${day.date}`}>
                <div style={bar(max > 0 ? day.issued / max : 0)} />
              </div>
            </Tooltip>
          ))}
        </div>
        <div style={labels}>
          {visible.map((day, index) => (
            <div key={day.date} style={labelCell}>
              <Text variant="caption">{index % labelEvery === 0 ? toShortDate(day.date) : ''}</Text>
            </div>
          ))}
        </div>
      </If>
    </div>
  )
}
