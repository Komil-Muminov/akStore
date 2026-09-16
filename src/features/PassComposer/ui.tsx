import { useCallback, useState } from 'react'
import { PASS_HOLDER_MIN_LENGTH } from '@/entities/pass'
import { theme } from '@/shared/config'
import { Button, Icon, If, Text, TextInput } from '@/shared/ui'
import { DESCRIPTION, HINT_READY, HINT_TOO_SHORT, PLACEHOLDER, SUBMIT_LABEL, TITLE, type IProps } from './model'
import { footer, form, heading, root } from './style'

export const PassComposer = ({ onCreate, pending, error }: IProps) => {
  const [draft, setDraft] = useState('')
  const holderName = draft.trim()
  const tooShort = holderName.length < PASS_HOLDER_MIN_LENGTH
  const disabled = pending || tooShort
  const hint = draft.length === 0 ? '' : tooShort ? HINT_TOO_SHORT : HINT_READY

  const submit = useCallback(() => {
    if (disabled) return
    onCreate(holderName)
    setDraft('')
  }, [disabled, holderName, onCreate])

  return (
    <div style={root} testId="pass-composer">
      <div style={heading}>
        <Icon name="plus" size={theme.size.iconMd} color={theme.colors.accent} />
        <Text variant="title">{TITLE}</Text>
      </div>
      <Text variant="secondary">{DESCRIPTION}</Text>
      <div style={form}>
        <TextInput
          testId="pass-composer__input"
          value={draft}
          placeholder={PLACEHOLDER}
          icon="user"
          autoFocus
          onChange={setDraft}
          onSubmit={submit}
        />
        <Button testId="pass-composer__submit" label={SUBMIT_LABEL} icon="check" onClick={submit} disabled={disabled} />
      </div>
      <div style={footer}>
        <If condition={error !== undefined} fallback={<Text variant="caption">{hint}</Text>}>
          <Icon name="x" size={theme.size.iconSm} color={theme.colors.danger} />
          <Text variant="danger">{error ?? ''}</Text>
        </If>
      </div>
    </div>
  )
}
