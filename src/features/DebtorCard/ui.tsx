import { useCallback, useState } from 'react'
import { moneyOf } from '@/entities/product'
import { saleStampOf } from '@/entities/sale'
import { Button, If, Modal, Text, TextInput } from '@/shared/ui'
import {
  AMOUNT_HINT,
  BALANCE_LABEL,
  CLOSE_LABEL,
  DESCRIPTION,
  EMPTY_HINT,
  ESTIMATED_ROW_HEIGHT,
  LEND_LABEL,
  NOTE_HINT,
  REPAY_LABEL,
  type IProps,
} from './model'
import { actions, amount, amountField, balanceBox, balanceValue, body, controls, list, row, rowText } from './style'

const toNumber = (value: string) => Number(value.replace(',', '.')) || 0

export const DebtorCard = ({ open, card, pending, error, onLend, onRepay, onClose }: IProps) => {
  const [sum, setSum] = useState('')
  const [note, setNote] = useState('')

  const reset = useCallback(() => {
    setSum('')
    setNote('')
  }, [])
  const handleLend = useCallback(() => {
    onLend(toNumber(sum), note)
    reset()
  }, [onLend, sum, note, reset])
  const handleRepay = useCallback(() => {
    onRepay(toNumber(sum), note)
    reset()
  }, [onRepay, sum, note, reset])

  return (
    <Modal
      open={open}
      title={card?.debtor.name ?? ''}
      description={DESCRIPTION}
      icon="users"
      onClose={onClose}
      testId="debtor__card"
    >
      <div style={body}>
        <div style={balanceBox}>
          <Text variant="caption">{BALANCE_LABEL}</Text>
          <text style={balanceValue((card?.debtor.balance ?? 0) > 0)}>{moneyOf(card?.debtor.balance ?? 0)}</text>
        </div>
        <div style={controls}>
          <TextInput value={sum} onChange={setSum} placeholder={AMOUNT_HINT} style={amountField} testId="debtor__amount" />
          <TextInput value={note} onChange={setNote} placeholder={NOTE_HINT} testId="debtor__comment" />
          <Button label={LEND_LABEL} icon="plus" onClick={handleLend} disabled={pending || toNumber(sum) <= 0} testId="debtor__lend" />
          <Button
            label={REPAY_LABEL}
            variant="secondary"
            icon="check"
            onClick={handleRepay}
            disabled={pending || toNumber(sum) <= 0}
            testId="debtor__repay"
          />
        </div>
        <If condition={(card?.moves.length ?? 0) > 0} fallback={<Text variant="secondary">{EMPTY_HINT}</Text>}>
          <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="debtor__moves">
            {(card?.moves ?? []).map((move) => (
              <div key={move.id} style={row}>
                <div style={rowText}>
                  <Text variant="body">{move.note.length > 0 ? move.note : move.authorName}</Text>
                  <Text variant="caption">{saleStampOf(move.createdAt)}</Text>
                </div>
                <text style={amount(move.amount > 0)}>{moneyOf(Math.abs(move.amount))}</text>
              </div>
            ))}
          </virtual-list>
        </If>
        <If condition={error !== undefined}>
          <Text variant="danger">{error ?? ''}</Text>
        </If>
        <div style={actions}>
          <Button label={CLOSE_LABEL} variant="secondary" onClick={onClose} />
        </div>
      </div>
    </Modal>
  )
}
