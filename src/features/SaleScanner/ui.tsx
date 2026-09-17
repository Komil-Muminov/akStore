import { theme } from '@/shared/config'
import { Icon, If, Spinner, Text, TextInput } from '@/shared/ui'
import {
  ALL_CATEGORIES,
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_TILE_HEIGHT,
  SEARCH_PLACEHOLDER,
  type IProps,
} from './model'
import { chips, empty, errorRow, head, list, root } from './style'
import { CategoryChip } from './ui/CategoryChip'
import { ProductTile } from './ui/ProductTile'

export const SaleScanner = ({
  query,
  products,
  categories,
  activeCategory,
  loading,
  error,
  onQueryChange,
  onSubmit,
  onCategoryChange,
  onPick,
}: IProps) => (
  <div style={root} testId="sale__scanner">
    <div style={head}>
      <TextInput
        value={query}
        onChange={onQueryChange}
        onSubmit={onSubmit}
        placeholder={SEARCH_PLACEHOLDER}
        icon="search"
        autoFocus
        testId="sale__search"
      />
      <div style={chips}>
        <CategoryChip id={null} label={ALL_CATEGORIES} active={activeCategory === null} onSelect={onCategoryChange} />
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            id={category.id}
            label={category.name}
            active={activeCategory === category.id}
            onSelect={onCategoryChange}
          />
        ))}
      </div>
    </div>
    <If condition={error !== undefined}>
      <div style={errorRow}>
        <Text variant="danger">{error ?? ''}</Text>
      </div>
    </If>
    <If
      condition={loading}
      fallback={
        <If
          condition={products.length > 0}
          fallback={
            <div style={empty}>
              <Icon name="search" size={theme.size.iconXl} color={theme.colors.ghost} />
              <Text variant="title">{EMPTY_TITLE}</Text>
              <Text variant="secondary">{EMPTY_HINT}</Text>
            </div>
          }
        >
          <virtual-list estimatedItemHeight={ESTIMATED_TILE_HEIGHT} style={list} testId="sale__products">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} onPick={onPick} />
            ))}
          </virtual-list>
        </If>
      }
    >
      <Spinner />
    </If>
  </div>
)
