import { moneyOf } from '@/entities/product'
import type { ISupplier } from '@/entities/supplier'
import { theme } from '@/shared/config'
import { IconButton, Text, Tooltip } from '@/shared/ui'
import { ARCHIVE_TOOLTIP, EDIT_TOOLTIP, ESTIMATED_ROW_HEIGHT, INVOICES_LABEL } from '../model'
import { debtValue, list, row, rowText } from '../style'

interface IProps {
  suppliers: ISupplier[]
  onEdit: (supplier: ISupplier) => void
  onArchive: (supplier: ISupplier) => void
}

export const SupplierRows = ({ suppliers, onEdit, onArchive }: IProps) => (
  <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="suppliers__list">
    {suppliers.map((supplier) => (
      <div key={supplier.id} style={row}>
        <div style={rowText}>
          <Text variant="bodyStrong">{supplier.name}</Text>
          <Text variant="caption">
            {`${supplier.phone || '—'} · ${String(supplier.invoiceCount)} ${INVOICES_LABEL}`}
          </Text>
        </div>
        <text style={debtValue(supplier.debt > 0)}>{moneyOf(supplier.debt)}</text>
        <Tooltip title={EDIT_TOOLTIP}>
          <IconButton icon="pencil" onClick={() => onEdit(supplier)} testId={`suppliers__edit-${supplier.id}`} />
        </Tooltip>
        <Tooltip title={ARCHIVE_TOOLTIP}>
          <IconButton
            icon="trash"
            onClick={() => onArchive(supplier)}
            hoverColor={theme.colors.dangerSoft}
            testId={`suppliers__archive-${supplier.id}`}
          />
        </Tooltip>
      </div>
    ))}
  </virtual-list>
)
