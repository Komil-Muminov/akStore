import { theme } from '@/shared/config'
import { Icon, If, Text, TextInput, Tooltip } from '@/shared/ui'
import { PLACEHOLDER, SEND_TOOLTIP, type IProps } from './model'
import { error as errorStyle, field, root, sendButton } from './style'

export const ChatComposer = ({ value, disabled, pending, error, onChange, onSend }: IProps) => {
  const ready = !disabled && !pending && value.trim().length > 0

  return (
    <>
      <If condition={error !== undefined}>
        <div style={errorStyle}>
          <Text variant="danger">{error ?? ''}</Text>
        </div>
      </If>
      <div style={root} testId="chat__composer">
        <TextInput
          value={value}
          onChange={onChange}
          onSubmit={ready ? onSend : undefined}
          placeholder={PLACEHOLDER}
          style={field}
          testId="chat__input"
        />
        <Tooltip title={SEND_TOOLTIP}>
          <div style={sendButton(ready)} onClick={ready ? onSend : undefined} testId="chat__send">
            <Icon
              name="send"
              size={theme.size.iconMd}
              color={ready ? theme.colors.onAccent : theme.colors.ghost}
            />
          </div>
        </Tooltip>
      </div>
    </>
  )
}
