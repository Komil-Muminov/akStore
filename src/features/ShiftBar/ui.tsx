import { useCallback, useState } from 'react'
import { moneyOf } from '@/entities/product'
import { changeOf } from '@/entities/sale'
import { Button, IconButton, If, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  CARD_LABEL,
  CASH_LABEL,
  CHANGE_LABEL,
  CLOSED_HINT,
  CLOSED_TITLE,
  CLOSE_LABEL,
  RECEIPT_LABEL,
  RECEIPT_TOOLTIP,
  EXPECTED_LABEL,
  OPENING_LABEL,
  OPEN_LABEL,
  PAY_LABEL,
  CASH_FIELD_LABEL,
  CARD_FIELD_LABEL,
  EXACT_TOOLTIP,
  CASH_TOOLTIP,
  PARK_LABEL,
  PARK_TOOLTIP,
  PARKED_TOOLTIP,
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

export const ShiftBar = ({
  state,
  cartTotal,
  pending,
  error,
  notice,
  onOpen,
  onClose,
  onPay,
  lastSaleId,
  onPrintReceipt,
  parkedCount,
  canPark,
  onPark,
  onOpenParked,
  onOpenCash,
}: IProps) => {
  const [cash, setCash] = useState('')
  const [card, setCard] = useState('')
  const paid = toNumber(cash)
  const cardPaid = toNumber(card)
  const received = paid + cardPaid

  const handleOpen = useCallback(() => {
    onOpen(paid)
    setCash('')
  }, [onOpen, paid])
  const handleClose = useCallback(() => {
    onClose(paid, '')
    setCash('')
  }, [onClose, paid])
  const handlePay = useCallback(() => {
    onPay(paid, cardPaid)
    setCash('')
    setCard('')
  }, [onPay, paid, cardPaid])
  const handleExact = useCallback(() => {
    setCash(String(Math.max(cartTotal - cardPaid, 0)))
  }, [cartTotal, cardPaid])

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
              <TextInput
                value={cash}
                onChange={setCash}
                placeholder={CASH_FIELD_LABEL}
                icon="briefcase"
                style={cashField}
                testId="shift__paid"
              />
              <TextInput
                value={card}
                onChange={setCard}
                placeholder={CARD_FIELD_LABEL}
                icon="key"
                style={cashField}
                testId="shift__card"
              />
              <Tooltip title={EXACT_TOOLTIP}>
                <IconButton icon="check" onClick={handleExact} testId="shift__exact" />
              </Tooltip>
              <Text variant="secondary">{CHANGE_LABEL}</Text>
              <text style={changeText}>{moneyOf(changeOf(cartTotal, received))}</text>
              <Button
                label={PAY_LABEL}
                icon="check"
                onClick={handlePay}
                disabled={pending || cartTotal <= 0 || received < cartTotal}
                testId="shift__pay"
              />
              <Tooltip title={CASH_TOOLTIP}>
                <IconButton icon="briefcase" onClick={onOpenCash} testId="shift__cash" />
              </Tooltip>
              <Tooltip title={PARK_TOOLTIP}>
                <Button
                  label={PARK_LABEL}
                  variant="secondary"
                  icon="inbox"
                  onClick={onPark}
                  disabled={pending || !canPark}
                  testId="shift__park"
                />
              </Tooltip>
              <Tooltip title={PARKED_TOOLTIP}>
                <Button
                  label={String(parkedCount)}
                  variant="secondary"
                  icon="rotate"
                  onClick={onOpenParked}
                  disabled={pending}
                  testId="shift__parked"
                />
              </Tooltip>
              <If condition={lastSaleId !== null}>
                <Tooltip title={RECEIPT_TOOLTIP}>
                  <Button
                    label={RECEIPT_LABEL}
                    variant="secondary"
                    icon="printer"
                    onClick={onPrintReceipt}
                    testId="shift__receipt"
                  />
                </Tooltip>
              </If>
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
