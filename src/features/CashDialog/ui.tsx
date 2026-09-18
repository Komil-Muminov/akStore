import { useCallback, useState } from 'react'
import { CashMoveKind, CASH_MOVE_LABELS } from '@/entities/debt'
import { moneyOf } from '@/entities/product'
import { saleStampOf } from '@/entities/sale'
import { Button, If, Modal, Text, TextInput } from '@/shared/ui'
import {
  AMOUNT_HINT,
  CLOSE_LABEL,
  DESCRIPTION,
  EMPTY_HINT,
  ESTIMATED_ROW_HEIGHT,
  IN_LABEL,
  NOTE_HINT,
  OUT_LABEL,
  TITLE,
  type IProps,
} from './model'
import { actions, amount, body, controls, amountField, list, row, rowText } from './style'

const toNumber = (value: string) => Number(value.replace(',', '.')) || 0

export const CashDialog = ({ open, moves, pending, error, onMove, onClose }: IProps) => {
  const [sum, setSum] = useState('')
  const [note, setNote] = useState('')

  const send = useCallback(
    (kind: string) => {
      onMove(kind, toNumber(sum), note)
      setSum('')
      setNote('')
    },
    [onMove, sum, note],
  )
  const handleIn = useCallback(() => send(CashMoveKind.IN), [send])
  const handleOut = useCallback(() => send(CashMoveKind.OUT), [send])

  return (
    <Modal open={open} title={TITLE} description={DESCRIPTION} icon="briefcase" onClose={onClose} testId="cash__dialog">
      <div style={body}>
        <div style={controls}>
          <TextInput value={sum} onChange={setSum} placeholder={AMOUNT_HINT} style={amountField} testId="cash__amount" />
          <TextInput value={note} onChange={setNote} placeholder={NOTE_HINT} testId="cash__note" />
          <Button label={IN_LABEL} icon="plus" onClick={handleIn} disabled={pending || toNumber(sum) <= 0} testId="cash__in" />
          <Button
            label={OUT_LABEL}
            variant="secondary"
            icon="logOut"
            onClick={handleOut}
            disabled={pending || toNumber(sum) <= 0}
            testId="cash__out"
          />
        </div>
        <If condition={moves.length > 0} fallback={<Text variant="secondary">{EMPTY_HINT}</Text>}>
          <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="cash__moves">
            {moves.map((move) => (
              <div key={move.id} style={row}>
                <div style={rowText}>
                  <Text variant="body">
                    {`${CASH_MOVE_LABELS[move.kind]}${move.note.length > 0 ? ` · ${move.note}` : ''}`}
                  </Text>
                  <Text variant="caption">{`${saleStampOf(move.createdAt)} · ${move.authorName}`}</Text>
                </div>
                <text style={amount(move.kind === CashMoveKind.IN)}>{moneyOf(move.amount)}</text>
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
