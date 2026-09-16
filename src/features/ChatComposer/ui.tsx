import { theme } from '@/shared/config'
import { Icon, IconButton, If, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  CANCEL_TOOLTIP,
  EDIT_HINT,
  PLACEHOLDER,
  SAVE_TOOLTIP,
  SEND_TOOLTIP,
  type IProps,
} from './model'
import { editBanner, editText, error as errorStyle, field, root, sendButton } from './style'

export const ChatComposer = ({
  value,
  disabled,
  pending,
  editing,
  error,
  onChange,
  onSend,
  onCancelEdit,
}: IProps) => {
  const ready = !disabled && !pending && value.trim().length > 0

  return (
    <>
      <If condition={editing}>
        <div style={editBanner} testId="chat__edit-banner">
          <Icon name="pencil" size={theme.size.iconSm} color={theme.colors.info} />
          <div style={editText}>
            <Text variant="secondary">{EDIT_HINT}</Text>
          </div>
          <Tooltip title={CANCEL_TOOLTIP}>
            <IconButton icon="x" onClick={onCancelEdit} testId="chat__cancel-edit" />
          </Tooltip>
        </div>
      </If>
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
        <Tooltip title={editing ? SAVE_TOOLTIP : SEND_TOOLTIP}>
          <div style={sendButton(ready)} onClick={ready ? onSend : undefined} testId="chat__send">
            <Icon
              name={editing ? 'check' : 'send'}
              size={theme.size.iconMd}
              color={ready ? theme.colors.onAccent : theme.colors.ghost}
            />
          </div>
        </Tooltip>
      </div>
    </>
  )
}
