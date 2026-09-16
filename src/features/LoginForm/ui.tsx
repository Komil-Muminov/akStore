import { useGpuix, type EventPayload } from '@gpuix/react'
import { useCallback, useRef, useState } from 'react'
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
  const { renderer } = useGpuix()
  const loginRef = useRef<{ id: number } | null>(null)
  const passwordRef = useRef<{ id: number } | null>(null)
  const submitRef = useRef<{ id: number } | null>(null)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const invalid = login.trim().length < LOGIN_MIN_LENGTH || password.length < PASSWORD_MIN_LENGTH

  const focusLogin = useCallback(() => {
    if (loginRef.current?.id) {
      renderer?.focusElement?.(loginRef.current.id)
    } else {
      renderer?.focusPrevious?.()
    }
  }, [renderer])

  const focusPassword = useCallback(() => {
    if (passwordRef.current?.id) {
      renderer?.focusElement?.(passwordRef.current.id)
    } else {
      renderer?.focusNext?.()
    }
  }, [renderer])

  const focusSubmit = useCallback(() => {
    if (submitRef.current?.id) {
      renderer?.focusElement?.(submitRef.current.id)
    } else {
      renderer?.focusNext?.()
    }
  }, [renderer])

  const submit = useCallback(() => {
    setTouched(true)
    if (invalid || pending) return
    onSubmit({ login: login.trim(), password })
  }, [invalid, pending, login, password, onSubmit])

  const handleLoginKeyDown = useCallback(
    (event: EventPayload) => {
      const isTab = event.key?.toLowerCase() === 'tab' || event.keyChar === '\t'
      if (isTab) {
        if (event.modifiers?.shift) {
          focusSubmit()
        } else {
          focusPassword()
        }
      }
    },
    [focusPassword, focusSubmit],
  )

  const handlePasswordKeyDown = useCallback(
    (event: EventPayload) => {
      const isTab = event.key?.toLowerCase() === 'tab' || event.keyChar === '\t'
      if (isTab) {
        if (event.modifiers?.shift) {
          focusLogin()
        } else {
          focusSubmit()
        }
      }
    },
    [focusLogin, focusSubmit],
  )

  const handleSubmitKeyDown = useCallback(
    (event: EventPayload) => {
      const isTab = event.key?.toLowerCase() === 'tab' || event.keyChar === '\t'
      if (isTab) {
        if (event.modifiers?.shift) {
          focusPassword()
        } else {
          focusLogin()
        }
      }
    },
    [focusLogin, focusPassword],
  )

  const handleLoginSubmit = useCallback(() => {
    focusPassword()
  }, [focusPassword])

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
              inputRef={loginRef}
              value={login}
              onChange={setLogin}
              onSubmit={handleLoginSubmit}
              onKeyDown={handleLoginKeyDown}
              placeholder={LOGIN_PLACEHOLDER}
              icon="user"
              autoFocus
              tabIndex={1}
              testId="login__login"
            />
          </div>
          <div style={field}>
            <Text variant="label">{PASSWORD_LABEL}</Text>
            <PasswordInput
              inputRef={passwordRef}
              value={password}
              onChange={setPassword}
              onSubmit={submit}
              onKeyDown={handlePasswordKeyDown}
              placeholder={PASSWORD_PLACEHOLDER}
              tabIndex={2}
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
            buttonRef={submitRef}
            label={SUBMIT_LABEL}
            icon="key"
            size="lg"
            fullWidth
            tabIndex={3}
            onClick={submit}
            onKeyDown={handleSubmitKeyDown}
            disabled={pending}
            testId="login__submit"
          />
        </div>
      </div>
    </div>
  )
}


