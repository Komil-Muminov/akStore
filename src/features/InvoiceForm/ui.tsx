import { moneyOf } from '@/entities/product'
import { invoiceTotalOf } from '@/entities/supplier'
import { theme } from '@/shared/config'
import { Button, FormField, IconButton, If, Modal, Select, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  ADD_PRODUCT_LABEL,
  CANCEL_LABEL,
  COST_HINT,
  DESCRIPTION,
  EMPTY_HINT,
  ESTIMATED_ROW_HEIGHT,
  NOTE_LABEL,
  PAID_LABEL,
  PICK_PRODUCT,
  PICK_SUPPLIER,
  QUANTITY_HINT,
  REMOVE_TOOLTIP,
  SUBMIT_LABEL,
  SUPPLIER_LABEL,
  TITLE,
  TOTAL_LABEL,
  type IProps,
} from './model'
import { actions, body, half, list, pair, row, rowName, smallField, totalRow, totalValue } from './style'

const toNumber = (value: string) => Number(value.replace(',', '.')) || 0

export const InvoiceForm = ({
  open,
  suppliers,
  products,
  lines,
  supplierId,
  paid,
  note,
  pending,
  error,
  onSupplierChange,
  onAddProduct,
  onLineChange,
  onLineRemove,
  onPaidChange,
  onNoteChange,
  onSubmit,
  onClose,
}: IProps) => (
  <Modal open={open} title={TITLE} description={DESCRIPTION} icon="inbox" onClose={onClose} testId="invoice__form">
    <div style={body}>
      <Text variant="label">{SUPPLIER_LABEL}</Text>
      <Select
        value={supplierId}
        options={suppliers.map((supplier) => ({ id: supplier.id, label: supplier.name }))}
        placeholder={PICK_SUPPLIER}
        onChange={onSupplierChange}
        testId="invoice__supplier"
      />
      <Text variant="label">{ADD_PRODUCT_LABEL}</Text>
      <Select
        value={null}
        options={products.map((product) => ({ id: product.id, label: product.name }))}
        placeholder={PICK_PRODUCT}
        onChange={onAddProduct}
        testId="invoice__product"
      />
      <If condition={lines.length > 0} fallback={<Text variant="secondary">{EMPTY_HINT}</Text>}>
        <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="invoice__lines">
          {lines.map((line) => (
            <div key={line.productId} style={row}>
              <div style={rowName}>
                <Text variant="body">{line.name}</Text>
              </div>
              <TextInput
                value={String(line.quantity)}
                onChange={(value) => onLineChange(line.productId, toNumber(value), line.costPrice)}
                placeholder={QUANTITY_HINT}
                style={smallField}
                testId={`invoice__quantity-${line.productId}`}
              />
              <TextInput
                value={String(line.costPrice)}
                onChange={(value) => onLineChange(line.productId, line.quantity, toNumber(value))}
                placeholder={COST_HINT}
                style={smallField}
                testId={`invoice__cost-${line.productId}`}
              />
              <Tooltip title={REMOVE_TOOLTIP}>
                <IconButton
                  icon="trash"
                  size="sm"
                  onClick={() => onLineRemove(line.productId)}
                  hoverColor={theme.colors.dangerSoft}
                  testId={`invoice__remove-${line.productId}`}
                />
              </Tooltip>
            </div>
          ))}
        </virtual-list>
      </If>
      <div style={pair}>
        <div style={half}>
          <FormField label={PAID_LABEL} value={paid} onChange={onPaidChange} testId="invoice__paid" />
        </div>
        <div style={half}>
          <FormField label={NOTE_LABEL} value={note} onChange={onNoteChange} testId="invoice__note" />
        </div>
      </div>
      <div style={totalRow}>
        <Text variant="title">{TOTAL_LABEL}</Text>
        <text style={totalValue}>{moneyOf(invoiceTotalOf(lines))}</text>
      </div>
      <If condition={error !== undefined}>
        <Text variant="danger">{error ?? ''}</Text>
      </If>
      <div style={actions}>
        <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} />
        <Button
          label={SUBMIT_LABEL}
          icon="check"
          onClick={onSubmit}
          disabled={pending || supplierId === null || lines.length === 0}
          testId="invoice__submit"
        />
      </div>
    </div>
  </Modal>
)
