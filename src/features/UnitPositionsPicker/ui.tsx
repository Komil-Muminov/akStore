import { useCallback, useEffect, useState } from 'react'
import { Button, Checkbox, If, Modal, Text } from '@/shared/ui'
import { CANCEL_LABEL, DESCRIPTION, EMPTY, RANK_PREFIX, SUBMIT_LABEL, TITLE, type IProps } from './model'
import { footer, list, spacer } from './style'

export const UnitPositionsPicker = ({ unit, positions, pending, error, onSubmit, onClose }: IProps) => {
  const [selected, setSelected] = useState<string[]>([])
  const open = unit !== null

  useEffect(() => {
    if (open) setSelected(unit?.positionIds ?? [])
  }, [open, unit])

  const toggle = useCallback(
    (id: string) => setSelected((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id])),
    [],
  )
  const handleSubmit = useCallback(() => {
    if (pending) return
    onSubmit(positions.filter((position) => selected.includes(position.id)).map((position) => position.id))
  }, [pending, onSubmit, positions, selected])

  return (
    <Modal open={open} title={TITLE} description={unit ? `${unit.name}. ${DESCRIPTION}` : DESCRIPTION} icon="briefcase" onClose={onClose} testId="unit-positions">
      <If condition={positions.length > 0} fallback={<Text variant="secondary">{EMPTY}</Text>}>
        <div style={list}>
          {positions.map((position) => (
            <Checkbox
              key={position.id}
              label={position.name}
              hint={`${RANK_PREFIX}${String(position.rank)}`}
              checked={selected.includes(position.id)}
              onToggle={() => toggle(position.id)}
              testId={`unit-positions__item-${position.id}`}
            />
          ))}
        </div>
      </If>
      <div style={footer}>
        <div style={spacer}>
          <If condition={error !== undefined}>
            <Text variant="danger">{error ?? ''}</Text>
          </If>
        </div>
        <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} testId="unit-positions__cancel" />
        <Button label={SUBMIT_LABEL} icon="check" onClick={handleSubmit} disabled={pending} testId="unit-positions__submit" />
      </div>
    </Modal>
  )
}
