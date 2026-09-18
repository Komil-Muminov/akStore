import { useCallback, useEffect, useState } from 'react'
import { EMPTY_SUPPLIER, type ISupplierInput } from '@/entities/supplier'
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

export const SupplierForm = ({ open, initial, pending, error, onSubmit, onClose }: IProps) => {
  const [form, setForm] = useState<ISupplierInput>(EMPTY_SUPPLIER)

  useEffect(() => {
    setForm(initial ? { name: initial.name, phone: initial.phone, note: initial.note } : EMPTY_SUPPLIER)
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
      icon="briefcase"
      onClose={onClose}
      testId="supplier__form"
    >
      <div style={body}>
        <FormField label={NAME_LABEL} value={form.name} onChange={setName} isRequired autoFocus testId="supplier__name" />
        <FormField label={PHONE_LABEL} value={form.phone} onChange={setPhone} testId="supplier__phone" />
        <FormField
          label={NOTE_LABEL}
          value={form.note}
          onChange={setNote}
          placeholder={NOTE_HINT}
          testId="supplier__note"
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
            testId="supplier__submit"
          />
        </div>
      </div>
    </Modal>
  )
}
