import { useCallback, useEffect, useState } from 'react'
import {
  EMPTY_PASS_INPUT,
  normalizePassInput,
  toPassInput,
  validatePassInput,
  type IPassInput,
  type TPassErrors,
  type TPassField,
} from '@/entities/pass'
import { Button, If, Modal, Text } from '@/shared/ui'
import { CANCEL_LABEL, TITLES, type IProps } from './model'
import { footer, spacer } from './style'
import { renderFields } from './ui/renderFields'

export const PassForm = ({ mode, initial, pending, error, onSubmit, onClose }: IProps) => {
  const [values, setValues] = useState<IPassInput>(EMPTY_PASS_INPUT)
  const [errors, setErrors] = useState<TPassErrors>({})
  const open = mode !== null
  const copy = TITLES[mode ?? 'create']

  useEffect(() => {
    if (!open) return
    setValues(initial ? toPassInput(initial) : EMPTY_PASS_INPUT)
    setErrors({})
  }, [open, initial])

  const handleChange = useCallback((field: TPassField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }, [])

  const handleSubmit = useCallback(() => {
    const nextErrors = validatePassInput(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || pending) return
    onSubmit(normalizePassInput(values))
  }, [values, pending, onSubmit])

  return (
    <Modal
      open={open}
      title={copy.title}
      description={copy.description}
      icon={mode === 'edit' ? 'pencil' : 'plus'}
      onClose={onClose}
      testId="pass-form"
    >
      {renderFields({ values, errors, onChange: handleChange, onSubmit: handleSubmit })}
      <div style={footer}>
        <div style={spacer}>
          <If condition={error !== undefined}>
            <Text variant="danger">{error ?? ''}</Text>
          </If>
        </div>
        <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} testId="pass-form__cancel" />
        <Button label={copy.submit} icon="check" onClick={handleSubmit} disabled={pending} testId="pass-form__submit" />
      </div>
    </Modal>
  )
}
