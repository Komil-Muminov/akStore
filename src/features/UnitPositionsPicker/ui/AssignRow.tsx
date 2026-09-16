import { memo, useCallback } from 'react'
import { initialsOf } from '@/entities/pass'
import { ROLE_LABELS, type IUser } from '@/entities/user'
import { theme } from '@/shared/config'
import { Icon, IconButton, If, Select, Text, Tooltip, type ISelectOption } from '@/shared/ui'
import { ASSIGN_LABEL, CANCEL_PICK_TOOLTIP, CHANGE_TOOLTIP, EMPLOYEE_PLACEHOLDER, UNASSIGN_TOOLTIP } from '../model'
import { assignRow, person, personActions, personAvatar, personAvatarText, personText, picker, vacancy } from '../style'

interface IProps {
  positionId: string
  user: IUser | null
  editing: boolean
  options: ISelectOption[]
  onPick: (positionId: string, userId: string | null) => void
  onEdit: (positionId: string | null) => void
}

export const AssignRow = memo(({ positionId, user, editing, options, onPick, onEdit }: IProps) => {
  const startEdit = useCallback(() => onEdit(positionId), [onEdit, positionId])
  const stopEdit = useCallback(() => onEdit(null), [onEdit])
  const unassign = useCallback(() => onPick(positionId, null), [onPick, positionId])
  const handlePick = useCallback(
    (userId: string | null) => {
      onPick(positionId, userId)
      if (userId) onEdit(null)
    },
    [onPick, onEdit, positionId],
  )

  return (
    <div style={assignRow}>
      <If condition={editing}>
        <div style={picker}>
          <Select value={user?.id ?? null} options={options} onChange={handlePick} placeholder={EMPLOYEE_PLACEHOLDER} icon="search" autoOpen testId={`unit-positions__employee-${positionId}`} />
          <Tooltip title={CANCEL_PICK_TOOLTIP}>
            <IconButton icon="x" onClick={stopEdit} testId={`unit-positions__cancel-pick-${positionId}`} />
          </Tooltip>
        </div>
      </If>
      <If condition={!editing && user !== null}>
        <div style={person} testId={`unit-positions__person-${positionId}`}>
          <div style={personAvatar}>
            <text style={personAvatarText}>{initialsOf(user?.fullName || user?.login || '')}</text>
          </div>
          <div style={personText}>
            <Text variant="bodyStrong">{user?.fullName || user?.login || ''}</Text>
            <Text variant="caption">{user ? `${ROLE_LABELS[user.role]} · @${user.login}` : ''}</Text>
          </div>
          <div style={personActions}>
            <Tooltip title={CHANGE_TOOLTIP}>
              <IconButton icon="pencil" onClick={startEdit} testId={`unit-positions__change-${positionId}`} />
            </Tooltip>
            <Tooltip title={UNASSIGN_TOOLTIP}>
              <IconButton icon="x" onClick={unassign} hoverColor={theme.colors.dangerSoft} testId={`unit-positions__unassign-${positionId}`} />
            </Tooltip>
          </div>
        </div>
      </If>
      <If condition={!editing && user === null}>
        <div style={vacancy} onClick={startEdit} testId={`unit-positions__assign-${positionId}`}>
          <Icon name="plus" size={theme.size.iconMd} color={theme.colors.secondary} />
          <Text variant="secondary">{ASSIGN_LABEL}</Text>
        </div>
      </If>
    </div>
  )
})
