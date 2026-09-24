import { useCallback, useState } from 'react'
import { moneyOf } from '@/entities/product'
import { Button, If, Text, TextInput } from '@/shared/ui'
import { PayRow } from './ui/PayRow'
import {
  CARD_LABEL,
  CASH_LABEL,
  CLOSED_HINT,
  CLOSED_TITLE,
  EXPECTED_LABEL,
  OPENING_LABEL,
  OPEN_LABEL,
  REVENUE_LABEL,
  SALES_LABEL,
  SHIFT_LABEL,
  type IProps,
} from './model'
import {
  cashField,
  closedBox,
  closedText,
  noticeText,
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
  onExactCash,
  onExactCard,
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
            <PayRow
              cash={cash}
              card={card}
              cartTotal={cartTotal}
              received={received}
              pending={pending}
              parkedCount={parkedCount}
              canPark={canPark}
              lastSaleId={lastSaleId}
              onCashChange={setCash}
              onCardChange={setCard}
              onExact={handleExact}
              onExactCash={onExactCash}
              onExactCard={onExactCard}
              onPay={handlePay}
              onOpenCash={onOpenCash}
              onPark={onPark}
              onOpenParked={onOpenParked}
              onPrintReceipt={onPrintReceipt}
              onClose={handleClose}
            />
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
