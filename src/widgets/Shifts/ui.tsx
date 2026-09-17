import { moneyOf } from '@/entities/product'
import { saleStampOf, type IShift } from '@/entities/sale'
import { ApiRoutes, QueryKeys, theme } from '@/shared/config'
import { useGetQuery } from '@/shared/hooks'
import { Badge, Icon, If, Spinner, Text } from '@/shared/ui'
import {
  CLOSED_LABEL,
  DESCRIPTION,
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_ROW_HEIGHT,
  OPEN_LABEL,
  TITLE,
} from './model'
import { cell, empty, head, headText, list, root, row, rowText } from './style'

export const Shifts = () => {
  const shifts = useGetQuery<IShift[]>(QueryKeys.SHIFTS, ApiRoutes.SHIFT_LIST)
  const items = shifts.data ?? []

  return (
    <div style={root} testId="shifts__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
      </div>
      <If condition={shifts.isPending} fallback={
        <If
          condition={items.length > 0}
          fallback={
            <div style={empty}>
              <Icon name="calendar" size={theme.size.iconXl} color={theme.colors.ghost} />
              <Text variant="title">{EMPTY_TITLE}</Text>
              <Text variant="secondary">{EMPTY_HINT}</Text>
            </div>
          }
        >
          <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="shifts__list">
            {items.map((shift) => (
              <div key={shift.id} style={row}>
                <div style={rowText}>
                  <Text variant="bodyStrong">{`Смена №${String(shift.number)} · ${shift.cashierName}`}</Text>
                  <Text variant="caption">
                    {`${saleStampOf(shift.openedAt)}${shift.closedAt ? ' — ' + saleStampOf(shift.closedAt) : ''}`}
                  </Text>
                </div>
                <div style={cell}>
                  <Text variant="caption">Начало</Text>
                  <Text variant="bodyStrong">{moneyOf(shift.openingCash)}</Text>
                </div>
                <div style={cell}>
                  <Text variant="caption">Конец</Text>
                  <Text variant="bodyStrong">{shift.closingCash === null ? '—' : moneyOf(shift.closingCash)}</Text>
                </div>
                <Badge
                  tone={shift.closedAt === null ? 'success' : 'muted'}
                  label={shift.closedAt === null ? OPEN_LABEL : CLOSED_LABEL}
                />
              </div>
            ))}
          </virtual-list>
        </If>
      }>
        <Spinner />
      </If>
    </div>
  )
}
