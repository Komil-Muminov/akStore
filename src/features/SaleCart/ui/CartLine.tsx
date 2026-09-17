import { useCallback } from 'react'
import { moneyOf, quantityOf } from '@/entities/product'
import { lineTotalOf, type ICartLine } from '@/entities/sale'
import { theme } from '@/shared/config'
import { IconButton, Text, Tooltip } from '@/shared/ui'
import { MINUS_TOOLTIP, PLUS_TOOLTIP, QUANTITY_STEP, REMOVE_TOOLTIP } from '../model'
import { line, lineName, lineText, lineTotal, quantityBox, quantityText } from '../style'

interface IProps {
  entry: ICartLine
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export const CartLine = ({ entry, onQuantityChange, onRemove }: IProps) => {
  const increase = useCallback(
    () => onQuantityChange(entry.productId, entry.quantity + QUANTITY_STEP),
    [entry.productId, entry.quantity, onQuantityChange],
  )
  const decrease = useCallback(
    () => onQuantityChange(entry.productId, entry.quantity - QUANTITY_STEP),
    [entry.productId, entry.quantity, onQuantityChange],
  )
  const remove = useCallback(() => onRemove(entry.productId), [entry.productId, onRemove])

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
        <text style={quantityText}>{quantityOf(entry.quantity)}</text>
        <Tooltip title={PLUS_TOOLTIP}>
          <IconButton icon="plus" onClick={increase} testId={`cart__plus-${entry.productId}`} />
        </Tooltip>
      </div>
      <text style={lineTotal}>{moneyOf(lineTotalOf(entry))}</text>
      <Tooltip title={REMOVE_TOOLTIP}>
        <IconButton icon="trash" onClick={remove} hoverColor={theme.colors.dangerSoft} testId={`cart__remove-${entry.productId}`} />
      </Tooltip>
    </div>
  )
}
