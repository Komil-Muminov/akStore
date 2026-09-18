import { moneyOf } from '@/entities/product'
import { saleStampOf } from '@/entities/sale'
import { theme } from '@/shared/config'
import { Button, Icon, IconButton, If, Modal, Text, Tooltip } from '@/shared/ui'
import {
  CLOSE_LABEL,
  DESCRIPTION,
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_ROW_HEIGHT,
  POSITIONS_LABEL,
  REMOVE_TOOLTIP,
  RESTORE_TOOLTIP,
  TITLE,
  type IProps,
} from './model'
import { actions, body, empty, list, row, rowText, total } from './style'

export const ParkedSales = ({ open, parked, pending, error, onRestore, onRemove, onClose }: IProps) => (
  <Modal open={open} title={TITLE} description={DESCRIPTION} icon="inbox" onClose={onClose} testId="parked__dialog">
    <div style={body}>
      <If
        condition={parked.length > 0}
        fallback={
          <div style={empty}>
            <Icon name="inbox" size={theme.size.iconXl} color={theme.colors.ghost} />
            <Text variant="title">{EMPTY_TITLE}</Text>
            <Text variant="secondary">{EMPTY_HINT}</Text>
          </div>
        }
      >
        <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="parked__list">
          {parked.map((entry) => (
            <div key={entry.id} style={row}>
              <div style={rowText}>
                <Text variant="bodyStrong">
                  {entry.note.length > 0 ? entry.note : `${String(entry.lines.length)} ${POSITIONS_LABEL}`}
                </Text>
                <Text variant="caption">{`${saleStampOf(entry.createdAt)} · ${String(entry.lines.length)} ${POSITIONS_LABEL}`}</Text>
              </div>
              <text style={total}>{moneyOf(entry.total)}</text>
              <Tooltip title={RESTORE_TOOLTIP}>
                <IconButton
                  icon="rotate"
                  onClick={() => onRestore(entry.id)}
                  testId={`parked__restore-${entry.id}`}
                />
              </Tooltip>
              <Tooltip title={REMOVE_TOOLTIP}>
                <IconButton
                  icon="trash"
                  onClick={() => onRemove(entry.id)}
                  hoverColor={theme.colors.dangerSoft}
                  testId={`parked__remove-${entry.id}`}
                />
              </Tooltip>
            </div>
          ))}
        </virtual-list>
      </If>
      <If condition={error !== undefined}>
        <Text variant="danger">{error ?? ''}</Text>
      </If>
      <div style={actions}>
        <Button label={CLOSE_LABEL} variant="secondary" onClick={onClose} disabled={pending} />
      </div>
    </div>
  </Modal>
)
