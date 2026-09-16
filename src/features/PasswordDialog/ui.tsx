import { useCallback, useEffect, useState } from 'react'
import { PASSWORD_MIN_LENGTH } from '@/entities/user'
import { Button, If, Modal, PasswordInput, Text } from '@/shared/ui'
import {
  CANCEL_LABEL,
  CURRENT_LABEL,
  MISMATCH,
  NEXT_LABEL,
  REPEAT_LABEL,
  SUBMIT_LABEL,
  TITLES,
  TOO_SHORT,
  type IProps,
} from './model'
import { field, fieldRow, footer, spacer } from './style'

export const PasswordDialog = ({ mode, subject, pending, error, onSubmit, onClose }: IProps) => {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [touched, setTouched] = useState(false)
  const open = mode !== null
  const tooShort = next.length < PASSWORD_MIN_LENGTH
  const mismatch = next !== repeat
  const localError = !touched ? undefined : tooShort ? TOO_SHORT : mismatch ? MISMATCH : undefined

  useEffect(() => {
    if (!open) return
    setCurrent('')
    setNext('')
    setRepeat('')
    setTouched(false)
  }, [open])

  const submit = useCallback(() => {
    setTouched(true)
    if (tooShort || mismatch || pending) return
    onSubmit({ current, next })
  }, [tooShort, mismatch, pending, current, next, onSubmit])

  return (
    <Modal open={open} title={TITLES[mode ?? 'change']} description={subject} icon="key" onClose={onClose} testId="password-dialog">
      <If condition={mode === 'change'}>
        <div style={field}>
          <Text variant="label">{CURRENT_LABEL}</Text>
          <div style={fieldRow}>
            <PasswordInput value={current} onChange={setCurrent} onSubmit={submit} autoFocus testId="password-dialog__current" />
          </div>
        </div>
      </If>
      <div style={field}>
        <Text variant="label">{NEXT_LABEL}</Text>
        <div style={fieldRow}>
          <PasswordInput value={next} onChange={setNext} onSubmit={submit} autoFocus={mode === 'reset'} testId="password-dialog__next" />
        </div>
      </div>
      <div style={field}>
        <Text variant="label">{REPEAT_LABEL}</Text>
        <div style={fieldRow}>
          <PasswordInput value={repeat} onChange={setRepeat} onSubmit={submit} testId="password-dialog__repeat" />
        </div>
      </div>
      <div style={footer}>
        <div style={spacer}>
          <If condition={(error ?? localError) !== undefined}>
            <Text variant="danger">{error ?? localError ?? ''}</Text>
          </If>
        </div>
        <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} />
        <Button label={SUBMIT_LABEL} icon="check" onClick={submit} disabled={pending} testId="password-dialog__submit" />
      </div>
    </Modal>
  )
}
