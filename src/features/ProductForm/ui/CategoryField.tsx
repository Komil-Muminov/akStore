import type { ICategory } from '@/entities/product'
import { Select, Text } from '@/shared/ui'
import { CATEGORY_LABEL, NO_CATEGORY_OPTION } from '../model'
import { categoryControl } from '../style'

interface IProps {
  value: string | null
  categories: ICategory[]
  onChange: (id: string | null) => void
  onCreate: (name: string) => void
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}

export const CategoryField = ({ value, categories, onChange, onCreate, onRename, onRemove }: IProps) => (
  <div style={categoryControl}>
    <Text variant="label">{CATEGORY_LABEL}</Text>
    <Select
      value={value}
      options={categories.map((category) => ({ id: category.id, label: category.name }))}
      placeholder={NO_CATEGORY_OPTION}
      onChange={onChange}
      manage={{ onCreate, onRename, onRemove }}
      testId="product__category"
    />
  </div>
)
