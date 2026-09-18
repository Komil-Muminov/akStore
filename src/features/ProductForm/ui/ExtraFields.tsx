import { FAVORITE_LABEL, MIN_STOCK_LABEL, VAT_OPTIONS } from '@/entities/product'
import { Checkbox, FormField, Select, Text } from '@/shared/ui'
import { FAVORITE_HINT, MARK_HINT, MARK_LABEL, MIN_STOCK_HINT, VAT_LABEL } from '../model'
import { half, pair } from '../style'

interface IProps {
  vatRate: number
  markCode: string
  minStock: number
  isFavorite: boolean
  onVatChange: (value: string | null) => void
  onMarkChange: (value: string) => void
  onMinStockChange: (value: string) => void
  onFavoriteToggle: () => void
}

export const ExtraFields = ({
  vatRate,
  markCode,
  minStock,
  isFavorite,
  onVatChange,
  onMarkChange,
  onMinStockChange,
  onFavoriteToggle,
}: IProps) => (
  <>
    <div style={pair}>
      <div style={half}>
        <Text variant="label">{VAT_LABEL}</Text>
        <Select value={String(vatRate)} options={VAT_OPTIONS} onChange={onVatChange} testId="product__vat" />
      </div>
      <div style={half}>
        <FormField
          label={MARK_LABEL}
          value={markCode}
          onChange={onMarkChange}
          placeholder={MARK_HINT}
          testId="product__mark"
        />
      </div>
    </div>
    <div style={pair}>
      <div style={half}>
        <FormField
          label={MIN_STOCK_LABEL}
          value={minStock > 0 ? String(minStock) : ''}
          onChange={onMinStockChange}
          placeholder={MIN_STOCK_HINT}
          testId="product__min-stock"
        />
      </div>
      <div style={half}>
        <Text variant="label">{FAVORITE_LABEL}</Text>
        <Checkbox checked={isFavorite} label={FAVORITE_HINT} onToggle={onFavoriteToggle} testId="product__favorite" />
      </div>
    </div>
  </>
)
