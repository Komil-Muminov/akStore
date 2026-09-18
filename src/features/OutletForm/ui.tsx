import { useCallback, useEffect, useState } from 'react'
import { EMPTY_OUTLET, type IOutletInput } from '@/entities/outlet'
import { Button, FormField, If, Modal, Text } from '@/shared/ui'
import {
  ADDRESS_LABEL,
  CANCEL_LABEL,
  CREATE_TITLE,
  DESCRIPTION,
  EDIT_TITLE,
  NAME_LABEL,
  PHONE_LABEL,
  SUBMIT_LABEL,
  type IProps,
} from './model'
import { actions, body } from './style'

export const OutletForm = ({ open, initial, pending, error, onSubmit, onClose }: IProps) => {
  const [form, setForm] = useState<IOutletInput>(EMPTY_OUTLET)

  useEffect(() => {
    setForm(initial ? { name: initial.name, address: initial.address, phone: initial.phone } : EMPTY_OUTLET)
  }, [initial, open])

  const setName = useCallback((name: string) => setForm((current) => ({ ...current, name })), [])
  const setAddress = useCallback((address: string) => setForm((current) => ({ ...current, address })), [])
  const setPhone = useCallback((phone: string) => setForm((current) => ({ ...current, phone })), [])
  const handleSubmit = useCallback(() => onSubmit(form), [form, onSubmit])

  return (
    <Modal
      open={open}
      title={initial ? EDIT_TITLE : CREATE_TITLE}
      description={DESCRIPTION}
      icon="building"
      onClose={onClose}
      testId="outlet__form"
    >
      <div style={body}>
        <FormField label={NAME_LABEL} value={form.name} onChange={setName} isRequired autoFocus testId="outlet__name" />
        <FormField label={ADDRESS_LABEL} value={form.address} onChange={setAddress} testId="outlet__address" />
        <FormField label={PHONE_LABEL} value={form.phone} onChange={setPhone} testId="outlet__phone" />
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
            testId="outlet__submit"
          />
        </div>
      </div>
    </Modal>
  )
}
