import type { EventPayload, StyleDesc } from '@gpuix/react'
import { useCallback, useState } from 'react'
import { theme } from '@/shared/config'
import { Icon } from '../Icon'
import { IconButton } from '../IconButton'
import { MASK_CHAR } from './model'
import { input, inputTheme, root } from './style'

interface IProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  onKeyDown?: (event: EventPayload) => void
  placeholder?: string
  autoFocus?: boolean
  tabIndex?: number
  testId?: string
  style?: StyleDesc
  inputRef?: { current: { id: number } | null } | ((instance: { id: number } | null) => void)
}

export const PasswordInput = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder,
  autoFocus,
  tabIndex = 0,
  testId,
  style: customStyle,
  inputRef,
}: IProps) => {
  const [visible, setVisible] = useState(false)
  const displayed = visible ? value : MASK_CHAR.repeat(value.length)

  const handleChange = useCallback(
    (next: string) => {
      if (visible) {
        onChange(next)
        return
      }
      const typed = next.replaceAll(MASK_CHAR, '')
      const kept = next.length - typed.length
      onChange(value.slice(0, Math.min(kept, value.length)) + typed)
    },
    [visible, value, onChange],
  )
  const toggle = useCallback(() => setVisible((current) => !current), [])

  return (
    <div style={customStyle ? { ...root, ...customStyle } : root}>
      <Icon name="lock" size={theme.size.iconMd} color={theme.colors.tertiary} />
      <input
        ref={inputRef}
        testId={testId}
        value={displayed}
        placeholder={placeholder}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        onChange={(event) => handleChange(event.value ?? '')}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        theme={inputTheme}
        style={input}
      />
      <IconButton icon={visible ? 'eyeOff' : 'eye'} onClick={toggle} testId={testId ? `${testId}-toggle` : undefined} />
    </div>
  )
}
