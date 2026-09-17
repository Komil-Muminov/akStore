import type { ICategory } from '@/entities/product'
import { theme } from '@/shared/config'
import { If, IconButton, Select, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  ADD_CATEGORY_TOOLTIP,
  CANCEL_CATEGORY_TOOLTIP,
  CATEGORY_LABEL,
  NEW_CATEGORY_HINT,
  NO_CATEGORY_OPTION,
  SAVE_CATEGORY_TOOLTIP,
} from '../model'
import { categoryControl, categoryRow } from '../style'

interface IProps {
  value: string | null
  categories: ICategory[]
  adding: boolean
  draft: string
  pending: boolean
  onChange: (id: string | null) => void
  onDraftChange: (name: string) => void
  onStartAdd: () => void
  onCancelAdd: () => void
  onConfirmAdd: () => void
}

export const CategoryField = ({
  value,
  categories,
  adding,
  draft,
  pending,
  onChange,
  onDraftChange,
  onStartAdd,
  onCancelAdd,
  onConfirmAdd,
}: IProps) => (
  <div style={categoryControl}>
    <Text variant="label">{CATEGORY_LABEL}</Text>
    <div style={categoryRow}>
      <div style={categoryControl}>
        <If
          condition={adding}
          fallback={
            <Select
              value={value}
              options={categories.map((category) => ({ id: category.id, label: category.name }))}
              placeholder={NO_CATEGORY_OPTION}
              onChange={onChange}
              testId="product__category"
            />
          }
        >
          <TextInput
            value={draft}
            onChange={onDraftChange}
            placeholder={NEW_CATEGORY_HINT}
            testId="product__category-draft"
          />
        </If>
      </div>
      <If
        condition={adding}
        fallback={
          <Tooltip title={ADD_CATEGORY_TOOLTIP}>
            <IconButton
              icon="plus"
              variant="outline"
              onClick={onStartAdd}
              hoverColor={theme.colors.accentSoft}
              testId="product__category-add"
            />
          </Tooltip>
        }
      >
        <Tooltip title={SAVE_CATEGORY_TOOLTIP}>
          <IconButton
            icon="check"
            variant="outline"
            onClick={onConfirmAdd}
            color={pending || draft.trim().length === 0 ? theme.colors.ghost : theme.colors.accent}
            hoverColor={theme.colors.accentSoft}
            testId="product__category-save"
          />
        </Tooltip>
        <Tooltip title={CANCEL_CATEGORY_TOOLTIP}>
          <IconButton
            icon="x"
            variant="outline"
            onClick={onCancelAdd}
            hoverColor={theme.colors.dangerSoft}
            testId="product__category-cancel"
          />
        </Tooltip>
      </If>
    </div>
  </div>
)
