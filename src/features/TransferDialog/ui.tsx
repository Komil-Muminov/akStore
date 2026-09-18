import { useCallback, useState } from 'react'
import { moneyOf } from '@/entities/product'
import { Button, FormField, If, Modal, Select, Text } from '@/shared/ui'
import {
  CANCEL_LABEL,
  DESCRIPTION,
  FROM_LABEL,
  NOTE_HINT,
  PICK_PRODUCT_HINT,
  PRODUCT_LABEL,
  QUANTITY_LABEL,
  STOCKS_LABEL,
  SUBMIT_LABEL,
  TITLE,
  TO_LABEL,
  type IProps,
} from './model'
import { actions, body, half, pair, stockLine } from './style'

const toNumber = (value: string) => Number(value.replace(',', '.')) || 0

export const TransferDialog = ({
  open,
  outlets,
  products,
  stocks,
  productId,
  pending,
  error,
  onProductChange,
  onSubmit,
  onClose,
}: IProps) => {
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = useCallback(() => {
    if (!from || !to) return
    onSubmit(from, to, toNumber(quantity), note)
    setQuantity('')
    setNote('')
  }, [from, to, quantity, note, onSubmit])

  const outletOptions = outlets.map((outlet) => ({ id: outlet.id, label: outlet.name }))

  return (
    <Modal open={open} title={TITLE} description={DESCRIPTION} icon="car" onClose={onClose} testId="transfer__dialog">
      <div style={body}>
        <Text variant="label">{PRODUCT_LABEL}</Text>
        <Select
          value={productId}
          options={products.map((product) => ({ id: product.id, label: product.name }))}
          placeholder={PICK_PRODUCT_HINT}
          onChange={onProductChange}
          testId="transfer__product"
        />
        <If condition={stocks.length > 0}>
          <Text variant="caption">{STOCKS_LABEL}</Text>
          {stocks.map((stock) => (
            <div key={stock.outletId} style={stockLine}>
              <Text variant="body">{stock.outletName}</Text>
              <Text variant="bodyStrong">{moneyOf(stock.quantity)}</Text>
            </div>
          ))}
        </If>
        <div style={pair}>
          <div style={half}>
            <Text variant="label">{FROM_LABEL}</Text>
            <Select value={from} options={outletOptions} onChange={setFrom} testId="transfer__from" />
          </div>
          <div style={half}>
            <Text variant="label">{TO_LABEL}</Text>
            <Select value={to} options={outletOptions} onChange={setTo} testId="transfer__to" />
          </div>
        </div>
        <div style={pair}>
          <div style={half}>
            <FormField label={QUANTITY_LABEL} value={quantity} onChange={setQuantity} testId="transfer__quantity" />
          </div>
          <div style={half}>
            <FormField label={NOTE_HINT} value={note} onChange={setNote} testId="transfer__note" />
          </div>
        </div>
        <If condition={error !== undefined}>
          <Text variant="danger">{error ?? ''}</Text>
        </If>
        <div style={actions}>
          <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} />
          <Button
            label={SUBMIT_LABEL}
            icon="check"
            onClick={handleSubmit}
            disabled={pending || productId === null || !from || !to || toNumber(quantity) <= 0}
            testId="transfer__submit"
          />
        </div>
      </div>
    </Modal>
  )
}
