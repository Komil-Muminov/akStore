import { useCallback } from 'react'
import { moneyOf } from '@/entities/product'
import { cartSubtotalOf, cartTotalOf } from '@/entities/sale'
import { theme } from '@/shared/config'
import { Icon, IconButton, If, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  CART_TITLE,
  CLEAR_TOOLTIP,
  DISCOUNT_LABEL,
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_LINE_HEIGHT,
  SUBTOTAL_LABEL,
  TOTAL_LABEL,
  type IProps,
} from './model'
import { discountField, empty, grandTotal, head, list, root, totalRow, totals } from './style'
import { CartLine } from './ui/CartLine'

export const SaleCart = ({ lines, discount, onQuantityChange, onRemove, onDiscountChange, onClear }: IProps) => {
  const handleDiscount = useCallback(
    (value: string) => onDiscountChange(Number(value.replace(',', '.')) || 0),
    [onDiscountChange],
  )

  return (
    <div style={root} testId="cart">
      <div style={head}>
        <Text variant="title">{`${CART_TITLE} · ${String(lines.length)}`}</Text>
        <Tooltip title={CLEAR_TOOLTIP}>
          <IconButton icon="trash" onClick={onClear} hoverColor={theme.colors.dangerSoft} testId="cart__clear" />
        </Tooltip>
      </div>
      <If
        condition={lines.length > 0}
        fallback={
          <div style={empty}>
            <Icon name="listChecks" size={theme.size.iconXl} color={theme.colors.ghost} />
            <Text variant="title">{EMPTY_TITLE}</Text>
            <Text variant="secondary">{EMPTY_HINT}</Text>
          </div>
        }
      >
        <virtual-list estimatedItemHeight={ESTIMATED_LINE_HEIGHT} style={list} testId="cart__lines">
          {lines.map((entry) => (
            <CartLine key={entry.productId} entry={entry} onQuantityChange={onQuantityChange} onRemove={onRemove} />
          ))}
        </virtual-list>
      </If>
      <div style={totals}>
        <div style={totalRow}>
          <Text variant="secondary">{SUBTOTAL_LABEL}</Text>
          <Text variant="bodyStrong">{moneyOf(cartSubtotalOf(lines))}</Text>
        </div>
        <div style={totalRow}>
          <Text variant="secondary">{DISCOUNT_LABEL}</Text>
          <TextInput
            value={discount > 0 ? String(discount) : ''}
            onChange={handleDiscount}
            placeholder="0"
            style={discountField}
            testId="cart__discount"
          />
        </div>
        <div style={totalRow}>
          <Text variant="title">{TOTAL_LABEL}</Text>
          <text style={grandTotal}>{moneyOf(cartTotalOf(lines, discount))}</text>
        </div>
      </div>
    </div>
  )
}
