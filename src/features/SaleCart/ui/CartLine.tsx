import { useCallback } from 'react'
import { moneyOf, quantityOf } from '@/entities/product'
import { lineTotalOf, type ICartLine } from '@/entities/sale'
import { theme } from '@/shared/config'
import { IconButton, Text, TextInput, Tooltip } from '@/shared/ui'
import { LINE_DISCOUNT_HINT, MINUS_TOOLTIP, PLUS_TOOLTIP, QUANTITY_HINT, QUANTITY_STEP, REMOVE_TOOLTIP } from '../model'
import { line, lineDiscountField, lineName, lineText, lineTotal, quantityBox, quantityField } from '../style'

interface IProps {
  entry: ICartLine
  onQuantityChange: (productId: string, quantity: number) => void
  onLineDiscountChange: (productId: string, value: number) => void
  onRemove: (productId: string) => void
}

const numberOf = (raw: string) => Number(raw.replace(',', '.')) || 0

export const CartLine = ({ entry, onQuantityChange, onLineDiscountChange, onRemove }: IProps) => {
  const increase = useCallback(
    () => onQuantityChange(entry.productId, entry.quantity + QUANTITY_STEP),
    [entry.productId, entry.quantity, onQuantityChange],
  )
  const decrease = useCallback(
    () => onQuantityChange(entry.productId, entry.quantity - QUANTITY_STEP),
    [entry.productId, entry.quantity, onQuantityChange],
  )
  const remove = useCallback(() => onRemove(entry.productId), [entry.productId, onRemove])
  const setQuantity = useCallback(
    (raw: string) => onQuantityChange(entry.productId, numberOf(raw)),
    [entry.productId, onQuantityChange],
  )
  const setDiscount = useCallback(
    (raw: string) => onLineDiscountChange(entry.productId, numberOf(raw)),
    [entry.productId, onLineDiscountChange],
  )

  return (
    <div style={line} testId={`cart__line-${entry.productId}`}>
      <div style={lineText}>
        <text style={lineName}>{entry.name}</text>
        <Text variant="caption">{`${moneyOf(entry.price)} × ${quantityOf(entry.quantity)} ${entry.unit}`}</Text>
      </div>
      <div style={quantityBox}>
        <Tooltip title={MINUS_TOOLTIP}>
          <IconButton icon="ban" onClick={decrease} testId={`cart__minus-${entry.productId}`} />
        </Tooltip>
        <TextInput
          value={quantityOf(entry.quantity)}
          onChange={setQuantity}
          placeholder={QUANTITY_HINT}
          style={quantityField}
          testId={`cart__quantity-${entry.productId}`}
        />
        <Tooltip title={PLUS_TOOLTIP}>
          <IconButton icon="plus" onClick={increase} testId={`cart__plus-${entry.productId}`} />
        </Tooltip>
      </div>
      <TextInput
        value={entry.discount > 0 ? String(entry.discount) : ''}
        onChange={setDiscount}
        placeholder={LINE_DISCOUNT_HINT}
        style={lineDiscountField}
        testId={`cart__line-discount-${entry.productId}`}
      />
      <text style={lineTotal}>{moneyOf(lineTotalOf(entry))}</text>
      <Tooltip title={REMOVE_TOOLTIP}>
        <IconButton icon="trash" onClick={remove} hoverColor={theme.colors.dangerSoft} testId={`cart__remove-${entry.productId}`} />
      </Tooltip>
    </div>
  )
}
