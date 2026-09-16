import { useCallback, useState } from 'react'
import { POSITION_DEFAULT_RANK, POSITION_NAME_MIN_LENGTH } from '@/entities/position'
import { Button, If, Modal, Text, TextInput } from '@/shared/ui'
import { ADD_LABEL, CLOSE_LABEL, DESCRIPTION, EMPTY, NAME_PLACEHOLDER, RANK_PLACEHOLDER, TITLE, type IProps } from './model'
import { footer, form, list, nameWrap, rankWrap, spacer } from './style'
import { PositionRow } from './ui/PositionRow'

export const PositionsManager = ({ open, positions, pending, error, onCreate, onDelete, onClose }: IProps) => {
  const [name, setName] = useState('')
  const [rankText, setRankText] = useState('')
  const disabled = pending || name.trim().length < POSITION_NAME_MIN_LENGTH

  const handleCreate = useCallback(() => {
    if (disabled) return
    const parsed = Number(rankText)
    onCreate({ name: name.trim(), rank: Number.isFinite(parsed) && rankText.trim() ? parsed : POSITION_DEFAULT_RANK })
    setName('')
    setRankText('')
  }, [disabled, name, rankText, onCreate])

  return (
    <Modal open={open} title={TITLE} description={DESCRIPTION} icon="briefcase" onClose={onClose} testId="positions">
      <div style={form}>
        <div style={nameWrap}>
          <TextInput value={name} onChange={setName} onSubmit={handleCreate} placeholder={NAME_PLACEHOLDER} icon="briefcase" testId="positions__name" />
        </div>
        <div style={rankWrap}>
          <TextInput value={rankText} onChange={setRankText} onSubmit={handleCreate} placeholder={RANK_PLACEHOLDER} testId="positions__rank" />
        </div>
        <Button label={ADD_LABEL} icon="plus" onClick={handleCreate} disabled={disabled} testId="positions__add" />
      </div>
      <If condition={positions.length > 0} fallback={<Text variant="ghost">{EMPTY}</Text>}>
        <div style={list}>
          {positions.map((position) => (
            <PositionRow key={position.id} position={position} onDelete={onDelete} />
          ))}
        </div>
      </If>
      <div style={footer}>
        <div style={spacer}>
          <If condition={error !== undefined}>
            <Text variant="danger">{error ?? ''}</Text>
          </If>
        </div>
        <Button label={CLOSE_LABEL} variant="secondary" onClick={onClose} testId="positions__close" />
      </div>
    </Modal>
  )
}
