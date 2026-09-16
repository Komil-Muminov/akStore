import { useCallback, useState } from 'react'
import { PASS_HOLDER_MIN_LENGTH } from '@/entities/pass'
import { theme } from '@/shared/config'
import { Button, Icon, TextInput } from '@/shared/ui'
import { PLACEHOLDER, SUBMIT_LABEL, type IProps } from './model'
import { root, wrapper } from './style'

export const PassComposer = ({ onCreate, pending }: IProps) => {
  const [draft, setDraft] = useState('')
  const holderName = draft.trim()
  const disabled = pending || holderName.length < PASS_HOLDER_MIN_LENGTH

  const submit = useCallback(() => {
    if (disabled) return
    onCreate(holderName)
    setDraft('')
  }, [disabled, holderName, onCreate])

  return (
    <div style={wrapper}>
      <div style={root}>
        <Icon name="plus" color={theme.colors.tertiary} />
        <TextInput
          testId="pass-composer__input"
          value={draft}
          placeholder={PLACEHOLDER}
          autoFocus
          onChange={setDraft}
          onSubmit={submit}
        />
        <Button testId="pass-composer__submit" label={SUBMIT_LABEL} onClick={submit} disabled={disabled} />
      </div>
    </div>
  )
}
