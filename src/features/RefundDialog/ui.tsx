import { moneyOf, quantityOf } from '@/entities/product'
import { Button, If, Modal, Text, TextInput, Tooltip } from '@/shared/ui'
import { IconButton } from '@/shared/ui'
import { availableOf, refundTotalOf } from './lib'
import {
  ALL_LABEL,
  AVAILABLE_LABEL,
  CANCEL_LABEL,
  DESCRIPTION,
  ESTIMATED_ROW_HEIGHT,
  REFUNDED_LABEL,
  SUBMIT_LABEL,
  TITLE,
  TOTAL_LABEL,
  type IProps,
} from './model'
import { actions, body, field, list, row, rowText, totalRow, totalValue } from './style'

const toNumber = (value: string) => Number(value.replace(',', '.')) || 0

export const RefundDialog = ({ sale, picked, pending, error, onPick, onSubmit, onClose }: IProps) => (
  <Modal
    open={sale !== null}
    title={`${TITLE} №${String(sale?.number ?? 0)}`}
    description={DESCRIPTION}
    icon="rotate"
    onClose={onClose}
    testId="refund__dialog"
  >
    <div style={body}>
      <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="refund__items">
        {(sale?.items ?? []).map((item) => (
          <div key={item.id} style={row}>
            <div style={rowText}>
              <Text variant="body">{item.name}</Text>
              <Text variant="caption">
                {`${AVAILABLE_LABEL} ${quantityOf(availableOf(item))} · ${REFUNDED_LABEL} ${quantityOf(item.refunded)}`}
              </Text>
            </div>
            <TextInput
              value={picked[item.id] ? String(picked[item.id]) : ''}
              onChange={(value) => onPick(item.id, Math.min(toNumber(value), availableOf(item)))}
              placeholder="0"
              style={field}
              testId={`refund__quantity-${item.id}`}
            />
            <Tooltip title={ALL_LABEL}>
              <IconButton
                icon="checkCheck"
                size="sm"
                onClick={() => onPick(item.id, availableOf(item))}
                testId={`refund__all-${item.id}`}
              />
            </Tooltip>
          </div>
        ))}
      </virtual-list>
      <div style={totalRow}>
        <Text variant="title">{TOTAL_LABEL}</Text>
        <text style={totalValue}>{moneyOf(refundTotalOf(sale, picked))}</text>
      </div>
      <If condition={error !== undefined}>
        <Text variant="danger">{error ?? ''}</Text>
      </If>
      <div style={actions}>
        <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} />
        <Button
          label={SUBMIT_LABEL}
          icon="rotate"
          onClick={onSubmit}
          disabled={pending || refundTotalOf(sale, picked) <= 0}
          testId="refund__submit"
        />
      </div>
    </div>
  </Modal>
)
