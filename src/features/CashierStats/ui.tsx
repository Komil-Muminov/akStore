import { moneyOf } from '@/entities/product'
import { If, Text } from '@/shared/ui'
import { EMPTY_HINT, PROFIT_LABEL, RECEIPTS_LABEL, REFUND_LABEL, TITLE, type IProps } from './model'
import { amount, root, row, rowText } from './style'

export const CashierStats = ({ cashiers }: IProps) => (
  <div style={root} testId="report__cashiers">
    <Text variant="title">{TITLE}</Text>
    <If condition={cashiers.length > 0} fallback={<Text variant="secondary">{EMPTY_HINT}</Text>}>
      {cashiers.map((entry) => (
        <div key={entry.cashierId} style={row}>
          <div style={rowText}>
            <Text variant="bodyStrong">{entry.name}</Text>
            <Text variant="caption">
              {`${String(entry.salesCount)} ${RECEIPTS_LABEL} · ${PROFIT_LABEL} ${moneyOf(entry.profit)} · ${REFUND_LABEL} ${moneyOf(entry.refundTotal)}`}
            </Text>
          </div>
          <text style={amount}>{moneyOf(entry.revenue)}</text>
        </div>
      ))}
    </If>
  </div>
)
