import { moneyOf } from '@/entities/product'
import { If, Text } from '@/shared/ui'
import { PICKS_LIMIT, TITLE, type IProps } from './model'
import { grid, root, tile, tileName, tilePrice } from './style'

export const QuickPicks = ({ products, onPick }: IProps) => (
  <If condition={products.length > 0}>
    <div style={root} testId="sale__quick">
      <Text variant="caption">{TITLE}</Text>
      <div style={grid}>
        {products.slice(0, PICKS_LIMIT).map((product) => (
          <div
            key={product.id}
            style={tile}
            onClick={() => onPick(product)}
            testId={`sale__quick-${product.id}`}
          >
            <text style={tileName}>{product.name}</text>
            <text style={tilePrice}>{moneyOf(product.salePrice)}</text>
          </div>
        ))}
      </div>
    </div>
  </If>
)
