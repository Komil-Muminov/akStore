import { theme } from '@/shared/config'
import { Icon, If, Text } from '@/shared/ui'
import { EMPTY_HINT, EMPTY_TITLE, ESTIMATED_ROW_HEIGHT, type IProps } from './model'
import { empty, list } from './style'
import { ProductRow } from './ui/ProductRow'

export const ProductList = ({ products, onEdit, onStock, onArchive }: IProps) => (
  <If
    condition={products.length > 0}
    fallback={
      <div style={empty} testId="product__empty">
        <Icon name="listChecks" size={theme.size.iconXl} color={theme.colors.ghost} />
        <Text variant="title">{EMPTY_TITLE}</Text>
        <Text variant="secondary">{EMPTY_HINT}</Text>
      </div>
    }
  >
    <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="product__list">
      {products.map((product) => (
        <ProductRow key={product.id} product={product} onEdit={onEdit} onStock={onStock} onArchive={onArchive} />
      ))}
    </virtual-list>
  </If>
)
