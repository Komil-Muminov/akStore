import { moneyOf } from '@/entities/product'
import { changeOf } from '@/entities/sale'
import { Button, IconButton, If, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  CARD_FIELD_LABEL,
  CASH_FIELD_LABEL,
  CASH_TOOLTIP,
  CHANGE_LABEL,
  CLOSE_LABEL,
  EXACT_CARD_LABEL,
  EXACT_CARD_TOOLTIP,
  EXACT_CASH_LABEL,
  EXACT_CASH_TOOLTIP,
  EXACT_TOOLTIP,
  PARK_LABEL,
  PARK_TOOLTIP,
  PARKED_TOOLTIP,
  PAY_LABEL,
  RECEIPT_LABEL,
  RECEIPT_TOOLTIP,
} from '../model'
import { cashField, changeText, payRow } from '../style'

interface IProps {
  cash: string
  card: string
  cartTotal: number
  received: number
  pending: boolean
  parkedCount: number
  canPark: boolean
  lastSaleId: string | null
  onCashChange: (value: string) => void
  onCardChange: (value: string) => void
  onExact: () => void
  onExactCash?: () => void
  onExactCard?: () => void
  onPay: () => void
  onOpenCash: () => void
  onPark: () => void
  onOpenParked: () => void
  onPrintReceipt: () => void
  onClose: () => void
}

export const PayRow = ({
  cash,
  card,
  cartTotal,
  received,
  pending,
  parkedCount,
  canPark,
  lastSaleId,
  onCashChange,
  onCardChange,
  onExact,
  onExactCash,
  onExactCard,
  onPay,
  onOpenCash,
  onPark,
  onOpenParked,
  onPrintReceipt,
  onClose,
}: IProps) => (
    <div style={payRow}>
      <TextInput
        value={cash}
        onChange={onCashChange}
        placeholder={CASH_FIELD_LABEL}
        icon="briefcase"
        style={cashField}
        testId="shift__paid"
      />
      <TextInput
        value={card}
        onChange={onCardChange}
        placeholder={CARD_FIELD_LABEL}
        icon="key"
        style={cashField}
        testId="shift__card"
      />
      <Tooltip title={EXACT_TOOLTIP}>
        <IconButton icon="check" onClick={onExact} testId="shift__exact" />
      </Tooltip>
      <If condition={onExactCash !== undefined}>
        <Tooltip title={EXACT_CASH_TOOLTIP}>
          <Button
            label={EXACT_CASH_LABEL}
            variant="secondary"
            onClick={onExactCash}
            disabled={pending || cartTotal <= 0}
            testId="shift__exact-cash"
          />
        </Tooltip>
      </If>
      <If condition={onExactCard !== undefined}>
        <Tooltip title={EXACT_CARD_TOOLTIP}>
          <Button
            label={EXACT_CARD_LABEL}
            variant="secondary"
            onClick={onExactCard}
            disabled={pending || cartTotal <= 0}
            testId="shift__exact-card"
          />
        </Tooltip>
      </If>
      <Text variant="secondary">{CHANGE_LABEL}</Text>
      <text style={changeText}>{moneyOf(changeOf(cartTotal, received))}</text>
      <Button
        label={PAY_LABEL}
        icon="check"
        onClick={onPay}
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
        onClick={onClose}
        disabled={pending}
        testId="shift__close"
      />
    </div>
)
