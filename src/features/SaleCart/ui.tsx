import { useCallback } from 'react'
import { moneyOf } from '@/entities/product'
import { cartSubtotalOf, cartTotalOf, cartVatOf, DISCOUNT_OPTIONS, DiscountKind } from '@/entities/sale'
import { theme } from '@/shared/config'
import { Icon, IconButton, If, Select, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  CART_TITLE,
  CLEAR_TOOLTIP,
  DISCOUNT_LABEL,
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_LINE_HEIGHT,
  QUICK_DISCOUNTS,
  SUBTOTAL_LABEL,
  TOTAL_LABEL,
  VAT_ROW_LABEL,
  type IProps,
} from './model'
import {
  chipsRow,
  discountBox,
  discountChipOf,
  discountField,
  discountKindBox,
  empty,
  grandTotal,
  head,
  list,
  root,
  totalRow,
  totals,
} from './style'
import { CartLine } from './ui/CartLine'

export const SaleCart = ({
  lines,
  discount,
  discountKind,
  onQuantityChange,
  onLineDiscountChange,
  onRemove,
  onDiscountChange,
  onDiscountKindChange,
  onClear,
}: IProps) => {
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
            <CartLine
              key={entry.productId}
              entry={entry}
              onQuantityChange={onQuantityChange}
              onLineDiscountChange={onLineDiscountChange}
              onRemove={onRemove}
            />
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
          <div style={discountBox}>
            <TextInput
              value={discount > 0 ? String(discount) : ''}
              onChange={handleDiscount}
              placeholder="0"
              style={discountField}
              testId="cart__discount"
            />
            <div style={discountKindBox}>
              <Select
                value={discountKind}
                options={DISCOUNT_OPTIONS}
                onChange={onDiscountKindChange}
                testId="cart__discount-kind"
              />
            </div>
          </div>
        </div>
        <div style={chipsRow}>
          {QUICK_DISCOUNTS.map((pct) => (
            <div
              key={pct}
              style={discountChipOf(discount === pct && discountKind === DiscountKind.PERCENT)}
              onClick={() => {
                onDiscountChange(pct)
                onDiscountKindChange(DiscountKind.PERCENT)
              }}
              testId={`cart__discount-chip-${pct}`}
            >
              <Text variant="caption">{pct === 0 ? 'Сброс' : `${pct}%`}</Text>
            </div>
          ))}
        </div>
        <If condition={cartVatOf(lines, discount) > 0}>
          <div style={totalRow}>
            <Text variant="secondary">{VAT_ROW_LABEL}</Text>
            <Text variant="bodyStrong">{moneyOf(cartVatOf(lines, discount))}</Text>
          </div>
        </If>
        <div style={totalRow}>
          <Text variant="title">{TOTAL_LABEL}</Text>
          <text style={grandTotal}>{moneyOf(cartTotalOf(lines, discount))}</text>
        </div>
      </div>
    </div>
  )
}
