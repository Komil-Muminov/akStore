import { moneyOf } from '@/entities/product'
import { dayLabelOf } from '@/entities/report'
import { If, Text, Tooltip } from '@/shared/ui'
import { ratioOf } from './lib'
import { EMPTY_HINT, PROFIT_HINT, TITLE, type IProps } from './model'
import { barOf, column, empty, plot, root } from './style'

export const DailyChart = ({ points }: IProps) => (
  <div style={root} testId="report__chart">
    <Text variant="title">{TITLE}</Text>
    <If
      condition={points.length > 0}
      fallback={
        <div style={empty}>
          <Text variant="secondary">{EMPTY_HINT}</Text>
        </div>
      }
    >
      <div style={plot}>
        {points.map((point) => (
          <Tooltip
            key={point.day}
            title={`${moneyOf(point.revenue)} · ${PROFIT_HINT} ${moneyOf(point.profit)}`}
          >
            <div style={column}>
              <div style={barOf(ratioOf(point, points))} />
              <Text variant="caption">{dayLabelOf(point.day)}</Text>
            </div>
          </Tooltip>
        ))}
      </div>
    </If>
  </div>
)
