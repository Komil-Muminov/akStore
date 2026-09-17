import { useCallback } from 'react'
import { moneyOf, stockLabelOf, type IProduct } from '@/entities/product'
import { Text } from '@/shared/ui'
import { OUT_OF_STOCK } from '../model'
import { tile, tileName, tilePrice, tileText } from '../style'

interface IProps {
  product: IProduct
  onPick: (product: IProduct) => void
}

export const ProductTile = ({ product, onPick }: IProps) => {
  const empty = product.stock <= 0
  const handleClick = useCallback(() => {
    if (!empty) onPick(product)
  }, [empty, onPick, product])

  return (
    <div style={tile(empty)} onClick={handleClick} testId={`sale__product-${product.id}`}>
      <div style={tileText}>
        <text style={tileName}>{product.name}</text>
        <Text variant="caption">{empty ? OUT_OF_STOCK : stockLabelOf(product)}</Text>
      </div>
      <text style={tilePrice}>{moneyOf(product.salePrice)}</text>
    </div>
  )
}
