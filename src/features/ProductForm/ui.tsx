import { useCallback, useEffect, useState } from 'react'
import { ProductUnit, type IProductInput } from '@/entities/product'
import { Button, FormField, If, Modal, Select, Text } from '@/shared/ui'
import { CategoryField } from './ui/CategoryField'
import { ExtraFields } from './ui/ExtraFields'
import {
  BARCODE_HINT,
  BARCODE_LABEL,
  CANCEL_LABEL,
  COST_LABEL,
  CREATE_TITLE,
  DESCRIPTION,
  EDIT_TITLE,
  EMPTY_FORM,
  NAME_LABEL,
  PRICE_LABEL,
  SUBMIT_LABEL,
  UNIT_LABEL,
  UNIT_OPTIONS,
  type IProps,
} from './model'
import { actions, body, half, pair } from './style'

const toMoney = (value: string) => Number(value.replace(',', '.')) || 0

export const ProductForm = ({
  open,
  initial,
  categories,
  pending,
  error,
  onSubmit,
  onClose,
  onCreateCategory,
  onRenameCategory,
  onRemoveCategory,
  createdCategoryId,
}: IProps) => {
  const [form, setForm] = useState<IProductInput>(EMPTY_FORM)

  useEffect(() => {
    setForm(
      initial
        ? {
            barcode: initial.barcode,
            name: initial.name,
            categoryId: initial.categoryId,
            unit: initial.unit,
            costPrice: initial.costPrice,
            salePrice: initial.salePrice,
            vatRate: initial.vatRate,
            markCode: initial.markCode,
            isFavorite: initial.isFavorite,
            minStock: initial.minStock,
          }
        : EMPTY_FORM,
    )
  }, [initial, open])

  useEffect(() => {
    if (createdCategoryId === null) return
    setForm((current) => ({ ...current, categoryId: createdCategoryId }))
  }, [createdCategoryId])


  const setName = useCallback((name: string) => setForm((current) => ({ ...current, name })), [])
  const setBarcode = useCallback((barcode: string) => setForm((current) => ({ ...current, barcode })), [])
  const setCost = useCallback((value: string) => setForm((current) => ({ ...current, costPrice: toMoney(value) })), [])
  const setPrice = useCallback((value: string) => setForm((current) => ({ ...current, salePrice: toMoney(value) })), [])
  const setUnit = useCallback(
    (value: string | null) => setForm((current) => ({ ...current, unit: (value ?? ProductUnit.PIECE) as ProductUnit })),
    [],
  )
  const setVat = useCallback(
    (value: string | null) => setForm((current) => ({ ...current, vatRate: Number(value ?? 0) })),
    [],
  )
  const setMark = useCallback((markCode: string) => setForm((current) => ({ ...current, markCode })), [])
  const setMinStock = useCallback(
    (value: string) => setForm((current) => ({ ...current, minStock: toMoney(value) })),
    [],
  )
  const toggleFavorite = useCallback(
    () => setForm((current) => ({ ...current, isFavorite: !current.isFavorite })),
    [],
  )
  const setCategory = useCallback(
    (value: string | null) => setForm((current) => ({ ...current, categoryId: value })),
    [],
  )
  const handleRemoveCategory = useCallback(
    (id: string) => {
      setForm((current) => (current.categoryId === id ? { ...current, categoryId: null } : current))
      onRemoveCategory(id)
    },
    [onRemoveCategory],
  )
  const handleSubmit = useCallback(() => onSubmit(form), [form, onSubmit])

  return (
    <Modal
      open={open}
      title={initial ? EDIT_TITLE : CREATE_TITLE}
      description={DESCRIPTION}
      icon="listChecks"
      onClose={onClose}
      testId="product__form"
    >
      <div style={body}>
        <FormField label={NAME_LABEL} value={form.name} onChange={setName} isRequired autoFocus testId="product__name" />
        <FormField
          label={BARCODE_LABEL}
          value={form.barcode}
          onChange={setBarcode}
          placeholder={BARCODE_HINT}
          testId="product__barcode"
        />
        <div style={pair}>
          <CategoryField
            value={form.categoryId}
            categories={categories}
            onChange={setCategory}
            onCreate={onCreateCategory}
            onRename={onRenameCategory}
            onRemove={handleRemoveCategory}
          />
          <div style={half}>
            <Text variant="label">{UNIT_LABEL}</Text>
            <Select value={form.unit} options={UNIT_OPTIONS} onChange={setUnit} testId="product__unit" />
          </div>
        </div>
        <div style={pair}>
          <div style={half}>
            <FormField
              label={COST_LABEL}
              value={form.costPrice > 0 ? String(form.costPrice) : ''}
              onChange={setCost}
              testId="product__cost"
            />
          </div>
          <div style={half}>
            <FormField
              label={PRICE_LABEL}
              value={form.salePrice > 0 ? String(form.salePrice) : ''}
              onChange={setPrice}
              isRequired
              testId="product__price"
            />
          </div>
        </div>
        <ExtraFields
          vatRate={form.vatRate}
          markCode={form.markCode}
          minStock={form.minStock}
          isFavorite={form.isFavorite}
          onVatChange={setVat}
          onMarkChange={setMark}
          onMinStockChange={setMinStock}
          onFavoriteToggle={toggleFavorite}
        />
        <If condition={error !== undefined}>
          <Text variant="danger">{error ?? ''}</Text>
        </If>
        <div style={actions}>
          <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} />
          <Button
            label={SUBMIT_LABEL}
            icon="check"
            onClick={handleSubmit}
            disabled={pending || form.name.trim().length === 0 || form.salePrice <= 0}
            testId="product__submit"
          />
        </div>
      </div>
    </Modal>
  )
}
