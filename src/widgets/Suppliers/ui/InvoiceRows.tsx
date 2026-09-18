import { moneyOf } from '@/entities/product'
import { saleStampOf } from '@/entities/sale'
import type { IInvoice } from '@/entities/supplier'
import { IconButton, If, Text, Tooltip } from '@/shared/ui'
import { ESTIMATED_ROW_HEIGHT, PAID_LABEL, PAY_TOOLTIP, POSITIONS_LABEL } from '../model'
import { debtValue, list, row, rowText } from '../style'

interface IProps {
  invoices: IInvoice[]
  onPay: (invoice: IInvoice) => void
}

export const InvoiceRows = ({ invoices, onPay }: IProps) => (
  <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="invoices__list">
    {invoices.map((invoice) => (
      <div key={invoice.id} style={row}>
        <div style={rowText}>
          <Text variant="bodyStrong">{`№${String(invoice.number)} · ${invoice.supplierName}`}</Text>
          <Text variant="caption">
            {`${saleStampOf(invoice.createdAt)} · ${String(invoice.items.length)} ${POSITIONS_LABEL} · ${PAID_LABEL} ${moneyOf(invoice.paid)}`}
          </Text>
        </div>
        <text style={debtValue(invoice.total > invoice.paid)}>{moneyOf(invoice.total)}</text>
        <If condition={invoice.total > invoice.paid}>
          <Tooltip title={PAY_TOOLTIP}>
            <IconButton icon="check" onClick={() => onPay(invoice)} testId={`invoices__pay-${invoice.id}`} />
          </Tooltip>
        </If>
      </div>
    ))}
  </virtual-list>
)
