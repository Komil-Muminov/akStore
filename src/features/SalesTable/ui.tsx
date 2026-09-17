import { moneyOf } from '@/entities/product'
import { FISCAL_LABEL, PAYMENT_LABELS, saleStampOf } from '@/entities/sale'
import { theme } from '@/shared/config'
import { Badge, Icon, If, Pagination, Spinner, Text } from '@/shared/ui'
import {
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_ROW_HEIGHT,
  POSITIONS_LABEL,
  REFUNDED_LABEL,
  TITLE,
  type IProps,
} from './model'
import { empty, list, root, row, rowText, total } from './style'

export const SalesTable = ({ sales, page, totalPages, total: count, loading, onPageChange }: IProps) => (
  <div style={root} testId="report__sales">
    <Text variant="title">{`${TITLE} · ${String(count)}`}</Text>
    <If
      condition={loading}
      fallback={
        <If
          condition={sales.length > 0}
          fallback={
            <div style={empty}>
              <Icon name="chart" size={theme.size.iconXl} color={theme.colors.ghost} />
              <Text variant="title">{EMPTY_TITLE}</Text>
              <Text variant="secondary">{EMPTY_HINT}</Text>
            </div>
          }
        >
          <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="report__sales-list">
            {sales.map((sale) => (
              <div key={sale.id} style={row}>
                <div style={rowText}>
                  <Text variant="bodyStrong">{`Чек №${String(sale.number)} · ${sale.cashierName}`}</Text>
                  <Text variant="caption">
                    {`${saleStampOf(sale.createdAt)} · ${PAYMENT_LABELS[sale.payment]} · ${String(sale.items.length)} ${POSITIONS_LABEL}`}
                  </Text>
                </div>
                <If condition={sale.fiscal !== null}>
                  {() => <Badge tone="info" label={`${FISCAL_LABEL} ${sale.fiscal?.number ?? ''}`} />}
                </If>
                <If condition={sale.refundedAt !== null}>
                  <Badge tone="danger" label={REFUNDED_LABEL} />
                </If>
                <text style={total}>{moneyOf(sale.total)}</text>
              </div>
            ))}
          </virtual-list>
        </If>
      }
    >
      <Spinner />
    </If>
    <Pagination page={page} totalPages={totalPages} total={count} onPageChange={onPageChange} />
  </div>
)
