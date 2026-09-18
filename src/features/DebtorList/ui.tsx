import { moneyOf } from '@/entities/product'
import { theme } from '@/shared/config'
import { Icon, IconButton, If, Text, Tooltip } from '@/shared/ui'
import {
  ARCHIVE_TOOLTIP,
  EDIT_TOOLTIP,
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_ROW_HEIGHT,
  NO_DEBT_LABEL,
  OPEN_TOOLTIP,
  type IProps,
} from './model'
import { balance, empty, list, row, rowText } from './style'

export const DebtorList = ({ debtors, onOpen, onEdit, onArchive }: IProps) => (
  <If
    condition={debtors.length > 0}
    fallback={
      <div style={empty}>
        <Icon name="users" size={theme.size.iconXl} color={theme.colors.ghost} />
        <Text variant="title">{EMPTY_TITLE}</Text>
        <Text variant="secondary">{EMPTY_HINT}</Text>
      </div>
    }
  >
    <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="debts__list">
      {debtors.map((debtor) => (
        <div key={debtor.id} style={row}>
          <div style={rowText}>
            <Text variant="bodyStrong">{debtor.name}</Text>
            <Text variant="caption">{`${debtor.phone || '—'} · ${debtor.note || ''}`}</Text>
          </div>
          <text style={balance(debtor.balance > 0)}>
            {debtor.balance > 0 ? moneyOf(debtor.balance) : NO_DEBT_LABEL}
          </text>
          <Tooltip title={OPEN_TOOLTIP}>
            <IconButton icon="listChecks" onClick={() => onOpen(debtor)} testId={`debts__open-${debtor.id}`} />
          </Tooltip>
          <Tooltip title={EDIT_TOOLTIP}>
            <IconButton icon="pencil" onClick={() => onEdit(debtor)} testId={`debts__edit-${debtor.id}`} />
          </Tooltip>
          <Tooltip title={ARCHIVE_TOOLTIP}>
            <IconButton
              icon="trash"
              onClick={() => onArchive(debtor)}
              hoverColor={theme.colors.dangerSoft}
              testId={`debts__archive-${debtor.id}`}
            />
          </Tooltip>
        </div>
      ))}
    </virtual-list>
  </If>
)
