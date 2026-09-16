import { useCallback, useEffect, useState } from 'react'
import { UNIT_NAME_MIN_LENGTH, UNIT_TYPE_LABELS } from '@/entities/unit'
import { Button, FormField, If, Modal, Text } from '@/shared/ui'
import {
  CANCEL_LABEL,
  CREATE_TITLE_PREFIX,
  NAME_ERROR,
  NAME_LABEL,
  NAME_PLACEHOLDER,
  PARENT_PREFIX,
  RENAME_TITLE,
  SUBMIT_CREATE,
  SUBMIT_RENAME,
  type IProps,
} from './model'
import { footer, spacer } from './style'

export const UnitForm = ({ state, pending, error, onSubmit, onClose }: IProps) => {
  const [name, setName] = useState('')
  const [touched, setTouched] = useState(false)
  const open = state !== null
  const isRename = state?.mode === 'rename'
  const title = isRename ? RENAME_TITLE : `${CREATE_TITLE_PREFIX}${state ? UNIT_TYPE_LABELS[state.type].toLowerCase() : ''}`
  const description = state?.parent ? `${PARENT_PREFIX}${state.parent.name}` : undefined
  const invalid = name.trim().length < UNIT_NAME_MIN_LENGTH

  useEffect(() => {
    if (!open) return
    setName(state?.unit?.name ?? '')
    setTouched(false)
  }, [open, state])

  const handleSubmit = useCallback(() => {
    setTouched(true)
    if (invalid || pending) return
    onSubmit(name.trim())
  }, [invalid, pending, name, onSubmit])

  return (
    <Modal open={open} title={title} description={description} icon={isRename ? 'pencil' : 'plus'} onClose={onClose} testId="unit-form">
      <FormField
        label={NAME_LABEL}
        value={name}
        onChange={setName}
        onSubmit={handleSubmit}
        placeholder={NAME_PLACEHOLDER}
        icon="building"
        error={touched && invalid ? NAME_ERROR : undefined}
        isRequired
        autoFocus
        testId="unit-form__name"
      />
      <div style={footer}>
        <div style={spacer}>
          <If condition={error !== undefined}>
            <Text variant="danger">{error ?? ''}</Text>
          </If>
        </div>
        <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} testId="unit-form__cancel" />
        <Button label={isRename ? SUBMIT_RENAME : SUBMIT_CREATE} icon="check" onClick={handleSubmit} disabled={pending} testId="unit-form__submit" />
      </div>
    </Modal>
  )
}
