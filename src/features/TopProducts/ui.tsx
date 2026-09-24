import { moneyOf, quantityOf } from '@/entities/product'
import { If, Pagination, Text, Tooltip } from '@/shared/ui'
import { ABC_TOOLTIP, EMPTY_HINT, PROFIT_LABEL, QUANTITY_LABEL, SHARE_LABEL, TITLE, type IProps } from './model'
import { abcBadgeOf, abcTextOf, amount, list, profit, root, row, rowHead, rowText } from './style'

export const TopProducts = ({ products, page, totalPages, total, onPageChange }: IProps) => (
  <div style={root} testId="report__top">
    <Text variant="title">{`${TITLE} · ${String(total)}`}</Text>
    <If
      condition={products.length > 0}
      fallback={<Text variant="secondary">{EMPTY_HINT}</Text>}
    >
      <div style={list}>
        {products.map((product) => {
          const group = product.abcGroup ?? 'C'
          return (
            <div key={product.productId} style={row}>
              <Tooltip title={ABC_TOOLTIP[group] ?? ''}>
                <div style={abcBadgeOf(group)}>
                  <text style={abcTextOf(group)}>{group}</text>
                </div>
              </Tooltip>
              <div style={rowText}>
                <div style={rowHead}>
                  <Text variant="bodyStrong">{product.name}</Text>
                </div>
                <Text variant="caption">
                  {`${QUANTITY_LABEL} ${quantityOf(product.quantity)} · ${String(product.sharePercent ?? 0)}% ${SHARE_LABEL}`}
                </Text>
              </div>
              <text style={profit}>{`${PROFIT_LABEL} ${moneyOf(product.profit)}`}</text>
              <text style={amount}>{moneyOf(product.revenue)}</text>
            </div>
          )
        })}
      </div>
    </If>
    <Pagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
  </div>
)
