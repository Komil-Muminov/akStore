import { useMemo } from 'react'
import { moneyOf } from '@/entities/product'
import { FISCAL_LABEL, PAYMENT_LABELS, saleStampOf, type ISale } from '@/entities/sale'
import { ApiRoutes, QueryKeys, theme } from '@/shared/config'
import { useGetQuery } from '@/shared/hooks'
import { Badge, Icon, If, Spinner, Text } from '@/shared/ui'
import { DESCRIPTION, EMPTY_HINT, EMPTY_TITLE, ESTIMATED_ROW_HEIGHT, REFUNDED_LABEL, TITLE } from './model'
import { summaryOf } from './lib'
import { card, cards, cardValue, empty, head, headText, list, root, row, rowText, total } from './style'

export const SalesReport = () => {
  const sales = useGetQuery<ISale[]>(QueryKeys.SALES, ApiRoutes.SALES_SEARCH())
  const items = useMemo(() => sales.data ?? [], [sales.data])
  const summary = useMemo(() => summaryOf(items), [items])

  return (
    <div style={root} testId="report__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
      </div>
      <div style={cards}>
        {summary.map((entry) => (
          <div key={entry.label} style={card}>
            <Text variant="caption">{entry.label}</Text>
            <text style={cardValue(entry.muted)}>{entry.value}</text>
          </div>
        ))}
      </div>
      <If condition={sales.isPending} fallback={
        <If
          condition={items.length > 0}
          fallback={
            <div style={empty}>
              <Icon name="chart" size={theme.size.iconXl} color={theme.colors.ghost} />
              <Text variant="title">{EMPTY_TITLE}</Text>
              <Text variant="secondary">{EMPTY_HINT}</Text>
            </div>
          }
        >
          <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="report__list">
            {items.map((sale) => (
              <div key={sale.id} style={row}>
                <div style={rowText}>
                  <Text variant="bodyStrong">{`Чек №${String(sale.number)} · ${sale.cashierName}`}</Text>
                  <Text variant="caption">
                    {`${saleStampOf(sale.createdAt)} · ${PAYMENT_LABELS[sale.payment]} · ${String(sale.items.length)} поз.`}
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
      }>
        <Spinner />
      </If>
    </div>
  )
}
