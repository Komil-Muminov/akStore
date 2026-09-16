import { memo, useCallback } from 'react'
import { initialsOf } from '@/entities/pass'
import { ROLE_LABELS, UserRole, type IUser } from '@/entities/user'
import { theme } from '@/shared/config'
import { Badge, IconButton, If, Text, Tooltip } from '@/shared/ui'
import {
  ACTIVATE_TOOLTIP,
  ACTIVE_LABEL,
  DEACTIVATE_TOOLTIP,
  DELETE_TOOLTIP,
  INACTIVE_LABEL,
  LOGIN_PREFIX,
  RESET_TOOLTIP,
} from '../model'
import { actions, avatar, avatarText, info, row } from '../style'

interface IProps {
  user: IUser
  onResetPassword: (user: IUser) => void
  onToggleActive: (user: IUser) => void
  onDelete: (user: IUser) => void
}

export const UserRow = memo(({ user, onResetPassword, onToggleActive, onDelete }: IProps) => {
  const handleReset = useCallback(() => onResetPassword(user), [onResetPassword, user])
  const handleToggle = useCallback(() => onToggleActive(user), [onToggleActive, user])
  const handleDelete = useCallback(() => onDelete(user), [onDelete, user])
  const meta = `${LOGIN_PREFIX}${user.login} · ${ROLE_LABELS[user.role]}`

  return (
    <div testId={`user-list__row-${user.id}`} style={row(user.isActive)}>
      <div style={avatar(user.isActive)}>
        <text style={avatarText(user.isActive)}>{initialsOf(user.fullName || user.login)}</text>
      </div>
      <div style={info}>
        <Text variant="bodyStrong">{user.fullName || user.login}</Text>
        <Text variant="caption">{meta}</Text>
      </div>
      <div style={actions}>
        <If condition={user.role === UserRole.ADMIN}>
          <Badge label={ROLE_LABELS[UserRole.ADMIN]} tone="info" />
        </If>
        <Badge label={user.isActive ? ACTIVE_LABEL : INACTIVE_LABEL} tone={user.isActive ? 'success' : 'muted'} />
        <Tooltip title={RESET_TOOLTIP}>
          <IconButton icon="key" onClick={handleReset} testId={`user-list__reset-${user.id}`} />
        </Tooltip>
        <Tooltip title={user.isActive ? DEACTIVATE_TOOLTIP : ACTIVATE_TOOLTIP}>
          <IconButton
            icon={user.isActive ? 'ban' : 'rotate'}
            onClick={handleToggle}
            color={user.isActive ? theme.colors.secondary : theme.colors.accent}
            hoverColor={user.isActive ? theme.colors.dangerSoft : theme.colors.accentSoft}
            testId={`user-list__toggle-${user.id}`}
          />
        </Tooltip>
        <Tooltip title={DELETE_TOOLTIP}>
          <IconButton icon="trash" onClick={handleDelete} hoverColor={theme.colors.dangerSoft} testId={`user-list__delete-${user.id}`} />
        </Tooltip>
      </div>
    </div>
  )
})
