import { Text } from '@/shared/ui'
import { cardsOf } from './lib'
import type { IProps } from './model'
import { card, cardValue, root } from './style'

export const ReportSummary = ({ summary }: IProps) => (
  <div style={root} testId="report__summary">
    {cardsOf(summary).map((entry) => (
      <div key={entry.label} style={card}>
        <Text variant="caption">{entry.label}</Text>
        <text style={cardValue(entry.tone)}>{entry.value}</text>
      </div>
    ))}
  </div>
)
