import { memo, useCallback } from 'react'
import { PASS_STATUS_LABELS, PassStatus, initialsOf, type IPass } from '@/entities/pass'
import { theme } from '@/shared/config'
import { Badge, IconButton, If, Text, Tooltip } from '@/shared/ui'
import { DELETE_TOOLTIP, HOST_PREFIX, RESTORE_TOOLTIP, REVOKE_TOOLTIP } from '../model'
import { actions, avatar, avatarText, info, row, subline } from '../style'

interface IProps {
  pass: IPass
  selected: boolean
  onSelect: (id: string) => void
  onRevoke: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (pass: IPass) => void
}

const SEPARATOR = ' · '

export const PassRow = memo(({ pass, selected, onSelect, onRevoke, onRestore, onDelete }: IProps) => {
  const active = pass.status === PassStatus.ACTIVE
  const handleSelect = useCallback(() => onSelect(pass.id), [onSelect, pass.id])
  const handleRevoke = useCallback(() => onRevoke(pass.id), [onRevoke, pass.id])
  const handleRestore = useCallback(() => onRestore(pass.id), [onRestore, pass.id])
  const handleDelete = useCallback(() => onDelete(pass), [onDelete, pass])
  const meta = [pass.hostName ? `${HOST_PREFIX}${pass.hostName}` : '', pass.organization].filter(Boolean).join(SEPARATOR)

  return (
    <div testId={`pass-list__row-${pass.id}`} onClick={handleSelect} style={row(active, selected)}>
      <div style={avatar(active)}>
        <text style={avatarText(active)}>{initialsOf(pass.holderName)}</text>
      </div>
      <div style={info}>
        <Text variant="bodyStrong">{pass.holderName}</Text>
        <div style={subline}>
          <Text variant="caption">{meta}</Text>
        </div>
      </div>
      <div style={actions}>
        <Badge label={PASS_STATUS_LABELS[pass.status]} tone={active ? 'success' : 'muted'} />
        <If
          condition={active}
          fallback={
            <Tooltip title={RESTORE_TOOLTIP}>
              <IconButton icon="rotate" testId={`pass-list__restore-${pass.id}`} onClick={handleRestore} color={theme.colors.accent} />
            </Tooltip>
          }
        >
          <Tooltip title={REVOKE_TOOLTIP}>
            <IconButton
              icon="ban"
              testId={`pass-list__revoke-${pass.id}`}
              onClick={handleRevoke}
              color={theme.colors.secondary}
              hoverColor={theme.colors.dangerSoft}
            />
          </Tooltip>
        </If>
        <Tooltip title={DELETE_TOOLTIP}>
          <IconButton
            icon="trash"
            testId={`pass-list__delete-${pass.id}`}
            onClick={handleDelete}
            color={theme.colors.secondary}
            hoverColor={theme.colors.dangerSoft}
          />
        </Tooltip>
      </div>
    </div>
  )
})
