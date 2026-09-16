import { useCallback, useEffect, useState } from 'react'
import { LOGIN_MIN_LENGTH, PASSWORD_MIN_LENGTH, ROLE_HINTS, ROLE_LABELS, type UserRole } from '@/entities/user'
import { Button, FormField, If, Modal, PasswordInput, Text } from '@/shared/ui'
import {
  CANCEL_LABEL,
  DESCRIPTION,
  LOGIN_ERROR,
  LOGIN_LABEL,
  LOGIN_PATTERN,
  LOGIN_PLACEHOLDER,
  NAME_ERROR,
  NAME_LABEL,
  NAME_PLACEHOLDER,
  PASSWORD_ERROR,
  PASSWORD_LABEL,
  ROLE_LABEL,
  SUBMIT_LABEL,
  TITLE,
  type IProps,
} from './model'
import { field, fieldRow, footer, message, roleChip, roles as rolesStyle, spacer } from './style'

export const UserForm = ({ open, roles, pending, error, onSubmit, onClose }: IProps) => {
  const [role, setRole] = useState<UserRole | null>(null)
  const [fullName, setFullName] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const nameInvalid = fullName.trim().length < LOGIN_MIN_LENGTH
  const loginInvalid = login.trim().length < LOGIN_MIN_LENGTH || !LOGIN_PATTERN.test(login.trim())
  const passwordInvalid = password.length < PASSWORD_MIN_LENGTH
  const selectedRole = role ?? roles[0] ?? null

  useEffect(() => {
    if (!open) return
    setRole(null)
    setFullName('')
    setLogin('')
    setPassword('')
    setTouched(false)
  }, [open])

  const submit = useCallback(() => {
    setTouched(true)
    if (nameInvalid || loginInvalid || passwordInvalid || pending || !selectedRole) return
    onSubmit({ fullName: fullName.trim(), login: login.trim().toLowerCase(), password, role: selectedRole })
  }, [nameInvalid, loginInvalid, passwordInvalid, pending, selectedRole, fullName, login, password, onSubmit])

  return (
    <Modal open={open} title={TITLE} description={DESCRIPTION} icon="userCog" onClose={onClose} testId="user-form">
      <div style={field}>
        <Text variant="label">{ROLE_LABEL}</Text>
        <div style={rolesStyle}>
          {roles.map((entry) => (
            <div key={entry} style={roleChip(entry === selectedRole)} onClick={() => setRole(entry)} testId={`user-form__role-${entry}`}>
              <Text variant="bodyStrong">{ROLE_LABELS[entry]}</Text>
              <Text variant="caption">{ROLE_HINTS[entry]}</Text>
            </div>
          ))}
        </div>
      </div>
      <FormField label={NAME_LABEL} value={fullName} onChange={setFullName} onSubmit={submit} placeholder={NAME_PLACEHOLDER} icon="user" error={touched && nameInvalid ? NAME_ERROR : undefined} isRequired autoFocus testId="user-form__name" />
      <FormField label={LOGIN_LABEL} value={login} onChange={setLogin} onSubmit={submit} placeholder={LOGIN_PLACEHOLDER} icon="key" error={touched && loginInvalid ? LOGIN_ERROR : undefined} isRequired testId="user-form__login" />
      <div style={field}>
        <Text variant="label">{PASSWORD_LABEL}</Text>
        <div style={fieldRow}>
          <PasswordInput value={password} onChange={setPassword} onSubmit={submit} testId="user-form__password" />
        </div>
        <div style={message}>
          <If condition={touched && passwordInvalid}>
            <Text variant="danger">{PASSWORD_ERROR}</Text>
          </If>
        </div>
      </div>
      <div style={footer}>
        <div style={spacer}>
          <If condition={error !== undefined}>
            <Text variant="danger">{error ?? ''}</Text>
          </If>
        </div>
        <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} />
        <Button label={SUBMIT_LABEL} icon="check" onClick={submit} disabled={pending} testId="user-form__submit" />
      </div>
    </Modal>
  )
}
