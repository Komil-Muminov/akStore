import { useCallback } from 'react'
import { PASS_FIELD_LABELS, PASS_STATUS_LABELS, PassStatus, formatIssuedAt, initialsOf } from '@/entities/pass'
import { Badge, Button, IconButton, If, Text } from '@/shared/ui'
import { chatRequest } from '@/shared/lib'
import {
  DELETE_LABEL,
  DETAIL_ROWS,
  EDIT_LABEL,
  ISSUED_LABEL,
  RESTORE_LABEL,
  REVOKE_LABEL,
  TITLE,
  UPDATED_LABEL,
  WRITE_HOST_LABEL,
  type IProps,
} from './model'
import { actionRow, actions, avatar, avatarText, details, head, meta, person, root, spacer } from './style'
import { DetailRow } from './ui/DetailRow'

export const PassDetails = ({ pass, pending, onEdit, onRevoke, onRestore, onDelete, onClose }: IProps) => {
  const active = pass.status === PassStatus.ACTIVE
  const handleEdit = useCallback(() => onEdit(pass), [onEdit, pass])
  const handleRevoke = useCallback(() => onRevoke(pass.id), [onRevoke, pass.id])
  const handleRestore = useCallback(() => onRestore(pass.id), [onRestore, pass.id])
  const handleDelete = useCallback(() => onDelete(pass), [onDelete, pass])
  const handleWriteHost = useCallback(() => {
    if (pass.hostUserId) chatRequest.open(pass.hostUserId)
  }, [pass.hostUserId])

  return (
    <div style={root} testId="pass-details">
      <div style={head}>
        <Text variant="title">{TITLE}</Text>
        <div style={spacer} />
        <IconButton icon="x" onClick={onClose} testId="pass-details__close" />
      </div>
      <div style={person}>
        <div style={avatar(active)}>
          <text style={avatarText(active)}>{initialsOf(pass.holderName)}</text>
        </div>
        <Text variant="heading">{pass.holderName}</Text>
        <Badge label={PASS_STATUS_LABELS[pass.status]} tone={active ? 'success' : 'muted'} />
      </div>
      <div style={details}>
        {DETAIL_ROWS.map((spec) => (
          <DetailRow key={spec.name} icon={spec.icon} label={PASS_FIELD_LABELS[spec.name]} value={pass[spec.name]} />
        ))}
      </div>
      <div style={meta}>
        <Text variant="caption">{`${ISSUED_LABEL}: ${formatIssuedAt(pass.createdAt)}`}</Text>
        <If condition={pass.updatedAt !== pass.createdAt}>
          <Text variant="caption">{`${UPDATED_LABEL}: ${formatIssuedAt(pass.updatedAt)}`}</Text>
        </If>
      </div>
      <div style={spacer} />
      <div style={actions}>
        <div style={actionRow}>
          <Button label={EDIT_LABEL} icon="pencil" variant="secondary" fullWidth onClick={handleEdit} testId="pass-details__edit" />
          <If
            condition={active}
            fallback={
              <Button label={RESTORE_LABEL} icon="rotate" fullWidth onClick={handleRestore} disabled={pending} testId="pass-details__restore" />
            }
          >
            <Button label={REVOKE_LABEL} icon="ban" variant="secondary" fullWidth onClick={handleRevoke} disabled={pending} testId="pass-details__revoke" />
          </If>
        </div>
        <If condition={pass.hostUserId !== null}>
          <Button
            label={WRITE_HOST_LABEL}
            icon="message"
            variant="secondary"
            fullWidth
            onClick={handleWriteHost}
            testId="pass-details__write-host"
          />
        </If>
        <Button label={DELETE_LABEL} icon="trash" variant="danger" fullWidth onClick={handleDelete} disabled={pending} testId="pass-details__delete" />
      </div>
    </div>
  )
}
