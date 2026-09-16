import { useCallback, useState } from 'react'
import { LOGIN_MIN_LENGTH, PASSWORD_MIN_LENGTH } from '@/entities/user'
import { theme } from '@/shared/config'
import { Button, Icon, If, PasswordInput, Text, TextInput } from '@/shared/ui'
import {
  DESCRIPTION,
  LOGIN_LABEL,
  LOGIN_PLACEHOLDER,
  PASSWORD_LABEL,
  PASSWORD_PLACEHOLDER,
  REQUIRED_HINT,
  SUBMIT_LABEL,
  TITLE,
  type IProps,
} from './model'
import { brand, brandMark, card, field, formBody, message, root } from './style'

export const LoginForm = ({ pending, error, onSubmit }: IProps) => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const invalid = login.trim().length < LOGIN_MIN_LENGTH || password.length < PASSWORD_MIN_LENGTH

  const submit = useCallback(() => {
    setTouched(true)
    if (invalid || pending) return
    onSubmit({ login: login.trim(), password })
  }, [invalid, pending, login, password, onSubmit])

  return (
    <div style={root} testId="login">
      <div style={card}>
        <div style={brand}>
          <div style={brandMark}>
            <Icon name="shieldCheck" size={theme.size.iconLg} color={theme.colors.accent} />
          </div>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
        <div style={formBody}>
          <div style={field}>
            <Text variant="label">{LOGIN_LABEL}</Text>
            <TextInput
              value={login}
              onChange={setLogin}
              onSubmit={submit}
              placeholder={LOGIN_PLACEHOLDER}
              icon="user"
              autoFocus
              testId="login__login"
            />
          </div>
          <div style={field}>
            <Text variant="label">{PASSWORD_LABEL}</Text>
            <PasswordInput
              value={password}
              onChange={setPassword}
              onSubmit={submit}
              placeholder={PASSWORD_PLACEHOLDER}
              testId="login__password"
            />
          </div>
          <div style={message}>
            <If
              condition={error !== undefined}
              fallback={
                <If condition={touched && invalid}>
                  <Text variant="danger">{REQUIRED_HINT}</Text>
                </If>
              }
            >
              <Text variant="danger">{error ?? ''}</Text>
            </If>
          </div>
          <Button
            label={SUBMIT_LABEL}
            icon="key"
            size="lg"
            fullWidth
            onClick={submit}
            disabled={pending}
            testId="login__submit"
          />
        </div>
      </div>
    </div>
  )
}

