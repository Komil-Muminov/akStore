import { moneyOf, quantityOf } from '@/entities/product'
import { theme } from '@/shared/config'
import { Button, FormField, If, Modal, Text, TextInput } from '@/shared/ui'
import {
  CANCEL_LABEL,
  CHANGED_LABEL,
  CHECKED_LABEL,
  CLOSE_LABEL,
  DESCRIPTION,
  ESTIMATED_ROW_HEIGHT,
  FACT_HINT,
  FILLED_LABEL,
  NOTE_HINT,
  PRINT_LABEL,
  SHORTAGE_LABEL,
  STOCK_LABEL,
  SUBMIT_LABEL,
  SURPLUS_LABEL,
  TITLE,
  type IProps,
} from './model'
import { actions, body, field, list, row, rowText, stat, statValue, stats } from './style'

const filledOf = (counted: Record<string, string>) =>
  Object.values(counted).filter((value) => value.trim().length > 0).length

export const StocktakeDialog = ({
  open,
  lines,
  counted,
  note,
  result,
  pending,
  error,
  onCount,
  onNoteChange,
  onPrint,
  onSubmit,
  onClose,
}: IProps) => (
  <Modal open={open} title={TITLE} description={DESCRIPTION} icon="listChecks" onClose={onClose} testId="count__dialog">
    <div style={body}>
      <If condition={result !== null}>
        <div style={stats}>
          <div style={stat}>
            <Text variant="caption">{CHECKED_LABEL}</Text>
            <text style={statValue(theme.colors.text)}>{String(result?.checked ?? 0)}</text>
          </div>
          <div style={stat}>
            <Text variant="caption">{CHANGED_LABEL}</Text>
            <text style={statValue(theme.colors.info)}>{String(result?.changed ?? 0)}</text>
          </div>
          <div style={stat}>
            <Text variant="caption">{SHORTAGE_LABEL}</Text>
            <text style={statValue(theme.colors.danger)}>{moneyOf(result?.shortage ?? 0)}</text>
          </div>
          <div style={stat}>
            <Text variant="caption">{SURPLUS_LABEL}</Text>
            <text style={statValue(theme.colors.accentHover)}>{moneyOf(result?.surplus ?? 0)}</text>
          </div>
        </div>
      </If>
      <If condition={result === null}>
        <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="count__lines">
          {lines.map((line) => (
            <div key={line.productId} style={row}>
              <div style={rowText}>
                <Text variant="body">{line.name}</Text>
                <Text variant="caption">{`${line.barcode || '—'} · ${STOCK_LABEL} ${quantityOf(line.stock)}`}</Text>
              </div>
              <TextInput
                value={counted[line.productId] ?? ''}
                onChange={(value) => onCount(line.productId, value)}
                placeholder={FACT_HINT}
                style={field}
                testId={`count__fact-${line.productId}`}
              />
            </div>
          ))}
        </virtual-list>
        <FormField label={NOTE_HINT} value={note} onChange={onNoteChange} testId="count__note" />
        <Text variant="caption">{`${FILLED_LABEL}: ${String(filledOf(counted))} / ${String(lines.length)}`}</Text>
      </If>
      <If condition={error !== undefined}>
        <Text variant="danger">{error ?? ''}</Text>
      </If>
      <div style={actions}>
        <Button label={PRINT_LABEL} icon="printer" variant="secondary" onClick={onPrint} testId="count__print" />
        <Button label={result === null ? CANCEL_LABEL : CLOSE_LABEL} variant="secondary" onClick={onClose} />
        <If condition={result === null}>
          <Button
            label={SUBMIT_LABEL}
            icon="check"
            onClick={onSubmit}
            disabled={pending || filledOf(counted) === 0}
            testId="count__submit"
          />
        </If>
      </div>
    </div>
  </Modal>
)
