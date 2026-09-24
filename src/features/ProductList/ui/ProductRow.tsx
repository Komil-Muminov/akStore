import { useCallback } from 'react'
import { isLowStock, moneyOf, stockLabelOf, unitLabelOf, type IProduct } from '@/entities/product'
import { theme } from '@/shared/config'
import { IconButton, Text, Tooltip } from '@/shared/ui'
import { ARCHIVE_TOOLTIP, EDIT_TOOLTIP, LABEL_TOOLTIP, STOCK_TOOLTIP } from '../model'
import { actions, column, name, price, row, rowText, stock } from '../style'

interface IProps {
  product: IProduct
  onEdit: (product: IProduct) => void
  onStock: (product: IProduct) => void
  onArchive: (product: IProduct) => void
  onLabel: (product: IProduct) => void
}

export const ProductRow = ({ product, onEdit, onStock, onArchive, onLabel }: IProps) => {
  const edit = useCallback(() => onEdit(product), [onEdit, product])
  const stockMove = useCallback(() => onStock(product), [onStock, product])
  const archive = useCallback(() => onArchive(product), [onArchive, product])
  const label = useCallback(() => onLabel(product), [onLabel, product])

  return (
    <div style={row} testId={`product__row-${product.id}`}>
      <div style={rowText}>
        <text style={name}>{product.name}</text>
        <Text variant="caption">
          {`${product.barcode || unitLabelOf(product.unit)} · ${product.categoryName || '—'}`}
        </Text>
      </div>
      <div style={column}>
        <text style={price}>{moneyOf(product.salePrice)}</text>
        <Text variant="caption">{moneyOf(product.costPrice)}</Text>
      </div>
      <Tooltip title={isLowStock(product) ? `Остаток ниже нормы (мин: ${product.minStock})` : 'Остаток в норме'}>
        <div style={column}>
          <text style={stock(isLowStock(product))}>{stockLabelOf(product)}</text>
        </div>
      </Tooltip>
      <div style={actions}>
        <Tooltip title={STOCK_TOOLTIP}>
          <IconButton icon="download" onClick={stockMove} testId={`product__stock-${product.id}`} />
        </Tooltip>
        <Tooltip title={LABEL_TOOLTIP}>
          <IconButton icon="printer" onClick={label} testId={`product__label-${product.id}`} />
        </Tooltip>
        <Tooltip title={EDIT_TOOLTIP}>
          <IconButton icon="pencil" onClick={edit} testId={`product__edit-${product.id}`} />
        </Tooltip>
        <Tooltip title={ARCHIVE_TOOLTIP}>
          <IconButton icon="trash" onClick={archive} hoverColor={theme.colors.dangerSoft} testId={`product__archive-${product.id}`} />
        </Tooltip>
      </div>
    </div>
  )
}
