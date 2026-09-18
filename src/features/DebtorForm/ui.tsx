import { useCallback, useEffect, useState } from 'react'
import { EMPTY_DEBTOR, type IDebtorInput } from '@/entities/debt'
import { Button, FormField, If, Modal, Text } from '@/shared/ui'
import {
  CANCEL_LABEL,
  CREATE_TITLE,
  DESCRIPTION,
  EDIT_TITLE,
  NAME_LABEL,
  NOTE_HINT,
  NOTE_LABEL,
  PHONE_LABEL,
  SUBMIT_LABEL,
  type IProps,
} from './model'
import { actions, body } from './style'

export const DebtorForm = ({ open, initial, pending, error, onSubmit, onClose }: IProps) => {
  const [form, setForm] = useState<IDebtorInput>(EMPTY_DEBTOR)

  useEffect(() => {
    setForm(initial ? { name: initial.name, phone: initial.phone, note: initial.note } : EMPTY_DEBTOR)
  }, [initial, open])

  const setName = useCallback((name: string) => setForm((current) => ({ ...current, name })), [])
  const setPhone = useCallback((phone: string) => setForm((current) => ({ ...current, phone })), [])
  const setNote = useCallback((note: string) => setForm((current) => ({ ...current, note })), [])
  const handleSubmit = useCallback(() => onSubmit(form), [form, onSubmit])

  return (
    <Modal
      open={open}
      title={initial ? EDIT_TITLE : CREATE_TITLE}
      description={DESCRIPTION}
      icon="users"
      onClose={onClose}
      testId="debtor__form"
    >
      <div style={body}>
        <FormField label={NAME_LABEL} value={form.name} onChange={setName} isRequired autoFocus testId="debtor__name" />
        <FormField label={PHONE_LABEL} value={form.phone} onChange={setPhone} testId="debtor__phone" />
        <FormField
          label={NOTE_LABEL}
          value={form.note}
          onChange={setNote}
          placeholder={NOTE_HINT}
          testId="debtor__note"
        />
        <If condition={error !== undefined}>
          <Text variant="danger">{error ?? ''}</Text>
        </If>
        <div style={actions}>
          <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} />
          <Button
            label={SUBMIT_LABEL}
            icon="check"
            onClick={handleSubmit}
            disabled={pending || form.name.trim().length < 2}
            testId="debtor__submit"
          />
        </div>
      </div>
    </Modal>
  )
}
