import { useState } from 'react'
import { moneyOf } from '@/entities/product'
import { dayLabelOf, hourLabelOf } from '@/entities/report'
import { If, Text, Tooltip } from '@/shared/ui'
import { hourlyRatioOf, peakHourOf, ratioOf } from './lib'
import {
  CHECKS_LABEL,
  DAILY_TAB,
  DAILY_TITLE,
  EMPTY_HINT,
  HOURLY_TAB,
  HOURLY_TITLE,
  PEAK_LABEL,
  PROFIT_HINT,
  type IProps,
  type TChartMode,
} from './model'
import { barOf, column, empty, header, headerLeft, plot, root, tabOf, tabs } from './style'

export const DailyChart = ({ points, hourlyPoints = [] }: IProps) => {
  const [mode, setMode] = useState<TChartMode>('daily')
  const peak = peakHourOf(hourlyPoints)
  const isHourly = mode === 'hourly'
  const hasData = isHourly ? hourlyPoints.length > 0 : points.length > 0

  return (
    <div style={root} testId="report__chart">
      <div style={header}>
        <div style={headerLeft}>
          <Text variant="title">{isHourly ? HOURLY_TITLE : DAILY_TITLE}</Text>
          <If condition={isHourly && peak !== null && peak.revenue > 0}>
            <Text variant="secondary">
              {`${PEAK_LABEL}: ${hourLabelOf(peak?.hour ?? 0)} · ${moneyOf(peak?.revenue ?? 0)} (${peak?.salesCount ?? 0} ${CHECKS_LABEL})`}
            </Text>
          </If>
        </div>
        <div style={tabs}>
          <div style={tabOf(!isHourly)} onClick={() => setMode('daily')}>
            <Text variant="caption">{DAILY_TAB}</Text>
          </div>
          <div style={tabOf(isHourly)} onClick={() => setMode('hourly')}>
            <Text variant="caption">{HOURLY_TAB}</Text>
          </div>
        </div>
      </div>
      <If
        condition={hasData}
        fallback={
          <div style={empty}>
            <Text variant="secondary">{EMPTY_HINT}</Text>
          </div>
        }
      >
        <If
          condition={!isHourly}
          fallback={
            <div style={plot}>
              {hourlyPoints.map((point) => (
                <Tooltip
                  key={point.hour}
                  title={`${hourLabelOf(point.hour)} · ${moneyOf(point.revenue)} (${point.salesCount} ${CHECKS_LABEL}) · ${PROFIT_HINT} ${moneyOf(point.profit)}`}
                >
                  <div style={column}>
                    <div style={barOf(hourlyRatioOf(point, hourlyPoints), peak?.hour === point.hour && point.revenue > 0)} />
                    <Text variant="caption">{hourLabelOf(point.hour)}</Text>
                  </div>
                </Tooltip>
              ))}
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
      </If>
    </div>
  )
}
