import { useCallback, useState } from 'react'
import { moneyOf } from '@/entities/product'
import { changeOf, PaymentKind } from '@/entities/sale'
import { Button, If, Text, TextInput } from '@/shared/ui'
import {
  CARD_LABEL,
  CASH_LABEL,
  CHANGE_LABEL,
  CLOSED_HINT,
  CLOSED_TITLE,
  CLOSE_LABEL,
  EXPECTED_LABEL,
  OPENING_LABEL,
  OPEN_LABEL,
  PAID_LABEL,
  PAY_CARD_LABEL,
  PAY_CASH_LABEL,
  REVENUE_LABEL,
  SALES_LABEL,
  SHIFT_LABEL,
  type IProps,
} from './model'
import {
  cashField,
  changeText,
  closedBox,
  closedText,
  noticeText,
  payRow,
  root,
  stat,
  statValue,
  statsRow,
} from './style'

const toNumber = (value: string) => Number(value.replace(',', '.')) || 0

export const ShiftBar = ({ state, cartTotal, pending, error, notice, onOpen, onClose, onPay }: IProps) => {
  const [cash, setCash] = useState('')
  const paid = toNumber(cash)

  const handleOpen = useCallback(() => {
    onOpen(paid)
    setCash('')
  }, [onOpen, paid])
  const handleClose = useCallback(() => {
    onClose(paid, '')
    setCash('')
  }, [onClose, paid])
  const handleCash = useCallback(() => {
    onPay(PaymentKind.CASH, paid)
    setCash('')
  }, [onPay, paid])
  const handleCard = useCallback(() => {
    onPay(PaymentKind.CARD, cartTotal)
    setCash('')
  }, [onPay, cartTotal])

  return (
    <div style={root} testId="shift__bar">
      <If
        condition={state !== null}
        fallback={
          <div style={closedBox}>
            <div style={closedText}>
              <Text variant="title">{CLOSED_TITLE}</Text>
              <Text variant="secondary">{CLOSED_HINT}</Text>
            </div>
            <TextInput value={cash} onChange={setCash} placeholder={OPENING_LABEL} style={cashField} testId="shift__opening" />
            <Button label={OPEN_LABEL} icon="check" onClick={handleOpen} disabled={pending} testId="shift__open" />
          </div>
        }
      >
        {() => (
          <>
            <div style={statsRow}>
              <div style={stat}>
                <Text variant="caption">{SHIFT_LABEL}</Text>
                <text style={statValue}>{`№${String(state?.shift.number ?? 0)}`}</text>
              </div>
              <div style={stat}>
                <Text variant="caption">{SALES_LABEL}</Text>
                <text style={statValue}>{String(state?.totals.salesCount ?? 0)}</text>
              </div>
              <div style={stat}>
                <Text variant="caption">{REVENUE_LABEL}</Text>
                <text style={statValue}>{moneyOf(state?.totals.revenue ?? 0)}</text>
              </div>
              <div style={stat}>
                <Text variant="caption">{CASH_LABEL}</Text>
                <text style={statValue}>{moneyOf(state?.totals.cashTotal ?? 0)}</text>
              </div>
              <div style={stat}>
                <Text variant="caption">{CARD_LABEL}</Text>
                <text style={statValue}>{moneyOf(state?.totals.cardTotal ?? 0)}</text>
              </div>
              <div style={stat}>
                <Text variant="caption">{EXPECTED_LABEL}</Text>
                <text style={statValue}>{moneyOf(state?.totals.expectedCash ?? 0)}</text>
              </div>
            </div>
            <div style={payRow}>
              <TextInput value={cash} onChange={setCash} placeholder={PAID_LABEL} style={cashField} testId="shift__paid" />
              <Text variant="secondary">{CHANGE_LABEL}</Text>
              <text style={changeText}>{moneyOf(changeOf(cartTotal, paid))}</text>
              <Button
                label={PAY_CASH_LABEL}
                icon="check"
                onClick={handleCash}
                disabled={pending || cartTotal <= 0 || paid < cartTotal}
                testId="shift__pay-cash"
              />
              <Button
                label={PAY_CARD_LABEL}
                variant="secondary"
                icon="check"
                onClick={handleCard}
                disabled={pending || cartTotal <= 0}
                testId="shift__pay-card"
              />
              <Button
                label={CLOSE_LABEL}
                variant="secondary"
                icon="logOut"
                onClick={handleClose}
                disabled={pending}
                testId="shift__close"
              />
            </div>
            <If condition={error !== undefined}>
              <Text variant="danger">{error ?? ''}</Text>
            </If>
            <If condition={notice !== undefined}>
              <text style={noticeText}>{notice ?? ''}</text>
            </If>
          </>
        )}
      </If>
    </div>
  )
}
