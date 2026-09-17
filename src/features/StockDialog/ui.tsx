import { useCallback, useEffect, useState } from 'react'
import { stockLabelOf } from '@/entities/product'
import { Button, FormField, If, Modal, Select, Text } from '@/shared/ui'
import {
  ACTION_OPTIONS,
  CANCEL_LABEL,
  COST_LABEL,
  CURRENT_LABEL,
  NOTE_LABEL,
  QUANTITY_LABEL,
  StockAction,
  SUBMIT_LABEL,
  TITLE,
  type IProps,
} from './model'
import { actions, body } from './style'

const toNumber = (value: string) => Number(value.replace(',', '.')) || 0

export const StockDialog = ({ product, pending, error, onSubmit, onClose }: IProps) => {
  const [action, setAction] = useState<StockAction>(StockAction.INCOME)
  const [quantity, setQuantity] = useState('')
  const [cost, setCost] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    setAction(StockAction.INCOME)
    setQuantity('')
    setCost('')
    setNote('')
  }, [product])

  const handleAction = useCallback((value: string | null) => setAction((value ?? StockAction.INCOME) as StockAction), [])
  const handleSubmit = useCallback(() => {
    if (!product) return
    onSubmit({
      action,
      productId: product.id,
      quantity: toNumber(quantity),
      costPrice: toNumber(cost),
      note,
    })
  }, [action, cost, note, onSubmit, product, quantity])

  return (
    <Modal
      open={product !== null}
      title={TITLE}
      description={product?.name ?? ''}
      icon="download"
      onClose={onClose}
      testId="stock__dialog"
    >
      <div style={body}>
        <Text variant="secondary">{`${CURRENT_LABEL}: ${product ? stockLabelOf(product) : ''}`}</Text>
        <Select value={action} options={ACTION_OPTIONS} onChange={handleAction} testId="stock__action" />
        <FormField label={QUANTITY_LABEL} value={quantity} onChange={setQuantity} isRequired autoFocus testId="stock__quantity" />
        <If condition={action === StockAction.INCOME}>
          <FormField label={COST_LABEL} value={cost} onChange={setCost} testId="stock__cost" />
        </If>
        <FormField label={NOTE_LABEL} value={note} onChange={setNote} testId="stock__note" />
        <If condition={error !== undefined}>
          <Text variant="danger">{error ?? ''}</Text>
        </If>
        <div style={actions}>
          <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} />
          <Button
            label={SUBMIT_LABEL}
            icon="check"
            onClick={handleSubmit}
            disabled={pending || toNumber(quantity) <= 0}
            testId="stock__submit"
          />
        </div>
      </div>
    </Modal>
  )
}
