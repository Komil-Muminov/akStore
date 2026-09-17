import { moneyOf, quantityOf } from '@/entities/product'
import { If, Pagination, Text } from '@/shared/ui'
import { EMPTY_HINT, PROFIT_LABEL, QUANTITY_LABEL, TITLE, type IProps } from './model'
import { amount, list, profit, root, row, rowText } from './style'

export const TopProducts = ({ products, page, totalPages, total, onPageChange }: IProps) => (
  <div style={root} testId="report__top">
    <Text variant="title">{`${TITLE} · ${String(total)}`}</Text>
    <If
      condition={products.length > 0}
      fallback={<Text variant="secondary">{EMPTY_HINT}</Text>}
    >
      <div style={list}>
        {products.map((product) => (
          <div key={product.productId} style={row}>
            <div style={rowText}>
              <Text variant="bodyStrong">{product.name}</Text>
              <Text variant="caption">{`${QUANTITY_LABEL} ${quantityOf(product.quantity)}`}</Text>
            </div>
            <text style={profit}>{`${PROFIT_LABEL} ${moneyOf(product.profit)}`}</text>
            <text style={amount}>{moneyOf(product.revenue)}</text>
          </div>
        ))}
      </div>
    </If>
    <Pagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
  </div>
)
