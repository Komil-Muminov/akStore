import { PassStatus } from '@/entities/pass'
import { theme } from '@/shared/config'
import { Button, Icon, If, Text, TextInput } from '@/shared/ui'
import {
  CHECK_IN_LABEL,
  CHECK_OUT_LABEL,
  CODE_PLACEHOLDER,
  DESCRIPTION,
  EMPTY_HINT,
  EMPTY_TITLE,
  FIND_LABEL,
  RESET_LABEL,
  TITLE,
  type IProps,
} from './model'
import { actions, empty, notice, noticeText, root, searchField, searchRow } from './style'
import { PassCard } from './ui/PassCard'
import { detailsOf } from './lib'

export const GateScanner = ({
  code,
  found,
  pending,
  error,
  notice: message,
  onCodeChange,
  onFind,
  onCheckIn,
  onCheckOut,
  onReset,
}: IProps) => (
  <div style={root} testId="gate__scanner">
    <div>
      <Text variant="heading">{TITLE}</Text>
      <Text variant="secondary">{DESCRIPTION}</Text>
    </div>
    <div style={searchRow}>
      <TextInput
        value={code}
        onChange={onCodeChange}
        onSubmit={onFind}
        placeholder={CODE_PLACEHOLDER}
        icon="search"
        autoFocus
        style={searchField}
        testId="gate__code"
      />
      <Button label={FIND_LABEL} icon="search" onClick={onFind} disabled={pending || code.trim().length === 0} />
      <Button label={RESET_LABEL} variant="secondary" icon="rotate" onClick={onReset} />
    </div>
    <If condition={error !== undefined}>
      <div style={notice(true)}>
        <Text variant="danger">{error ?? ''}</Text>
      </div>
    </If>
    <If condition={message !== undefined}>
      <div style={notice(false)}>
        <text style={noticeText}>{message ?? ''}</text>
      </div>
    </If>
    <If
      condition={found !== null}
      fallback={
        <div style={empty} testId="gate__empty">
          <Icon name="shieldCheck" size={theme.size.iconXl} color={theme.colors.ghost} />
          <Text variant="title">{EMPTY_TITLE}</Text>
          <Text variant="secondary">{EMPTY_HINT}</Text>
        </div>
      }
    >
      {() => (
        <>
          <PassCard
            pass={found?.pass ?? ({} as never)}
            inside={found?.inside ?? false}
            rows={detailsOf(found?.pass ?? ({} as never))}
          />
          <div style={actions}>
            <Button
              label={CHECK_IN_LABEL}
              icon="check"
              onClick={onCheckIn}
              disabled={pending || found?.inside === true || found?.pass.status !== PassStatus.ACTIVE}
              testId="gate__check-in"
            />
            <Button
              label={CHECK_OUT_LABEL}
              variant="secondary"
              icon="logOut"
              onClick={onCheckOut}
              disabled={pending || found?.inside !== true}
              testId="gate__check-out"
            />
          </div>
        </>
      )}
    </If>
  </div>
)
