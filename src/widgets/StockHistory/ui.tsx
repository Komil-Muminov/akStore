import { MOVE_LABELS, moneyOf, quantityOf, type IStockMove } from '@/entities/product'
import { saleStampOf } from '@/entities/sale'
import { ApiRoutes, QueryKeys, theme } from '@/shared/config'
import { useGetQuery } from '@/shared/hooks'
import { Icon, If, Spinner, Text } from '@/shared/ui'
import { DESCRIPTION, EMPTY_HINT, EMPTY_TITLE, ESTIMATED_ROW_HEIGHT, TITLE, iconOf, toneOf } from './model'
import { empty, head, headText, list, mark, root, row, rowText, quantity } from './style'

export const StockHistory = () => {
  const moves = useGetQuery<IStockMove[]>(QueryKeys.STOCK_HISTORY, ApiRoutes.PRODUCTS_HISTORY())
  const items = moves.data ?? []

  return (
    <div style={root} testId="stock__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
      </div>
      <If condition={moves.isPending} fallback={
        <If
          condition={items.length > 0}
          fallback={
            <div style={empty}>
              <Icon name="download" size={theme.size.iconXl} color={theme.colors.ghost} />
              <Text variant="title">{EMPTY_TITLE}</Text>
              <Text variant="secondary">{EMPTY_HINT}</Text>
            </div>
          }
        >
          <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="stock__list">
            {items.map((move) => (
              <div key={move.id} style={row}>
                <div style={mark(toneOf(move.kind))}>
                  <Icon name={iconOf(move.kind)} size={theme.size.iconSm} color={toneOf(move.kind)} />
                </div>
                <div style={rowText}>
                  <Text variant="bodyStrong">{move.productName}</Text>
                  <Text variant="caption">
                    {`${MOVE_LABELS[move.kind]} · ${saleStampOf(move.createdAt)}${move.authorName ? ' · ' + move.authorName : ''}${move.note ? ' · ' + move.note : ''}`}
                  </Text>
                </div>
                <text style={quantity(move.quantity >= 0)}>
                  {`${move.quantity >= 0 ? '+' : ''}${quantityOf(move.quantity)}`}
                </text>
                <Text variant="caption">{move.costPrice > 0 ? moneyOf(move.costPrice) : ''}</Text>
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
