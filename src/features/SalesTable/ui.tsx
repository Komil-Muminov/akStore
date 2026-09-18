import { moneyOf } from '@/entities/product'
import { FISCAL_LABEL, PAYMENT_LABELS, saleStampOf } from '@/entities/sale'
import { theme } from '@/shared/config'
import { Badge, Icon, IconButton, If, Pagination, Spinner, Text, Tooltip } from '@/shared/ui'
import {
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_ROW_HEIGHT,
  PARTIAL_LABEL,
  POSITIONS_LABEL,
  PRINT_TOOLTIP,
  REFUND_TOOLTIP,
  REFUNDED_LABEL,
  TITLE,
  type IProps,
} from './model'
import { empty, list, root, row, rowText, total } from './style'

export const SalesTable = ({
  sales,
  page,
  totalPages,
  total: count,
  loading,
  onPageChange,
  onPrint,
  onRefund,
}: IProps) => (
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
                <If condition={sale.refundedAt === null && sale.refundTotal > 0}>
                  <Badge tone="muted" label={PARTIAL_LABEL} />
                </If>
                <text style={total}>{moneyOf(sale.total)}</text>
                <If condition={sale.refundedAt === null}>
                  <Tooltip title={REFUND_TOOLTIP}>
                    <IconButton icon="rotate" onClick={() => onRefund(sale)} testId={`report__refund-${sale.id}`} />
                  </Tooltip>
                </If>
                <Tooltip title={PRINT_TOOLTIP}>
                  <IconButton icon="printer" onClick={() => onPrint(sale)} testId={`report__print-${sale.id}`} />
                </Tooltip>
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
