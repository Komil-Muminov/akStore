import { memo, useCallback } from 'react'
import { PASS_STATUS_LABELS, PassStatus, formatIssuedAt, initialsOf, type IPass } from '@/entities/pass'
import { theme } from '@/shared/config'
import { Badge, IconButton, If, Text, Tooltip } from '@/shared/ui'
import { ISSUED_PREFIX, REVOKE_TOOLTIP } from '../model'
import { actions, avatar, avatarText, info, row } from '../style'

interface IProps {
  pass: IPass
  onDeactivate: (id: string) => void
}

export const PassRow = memo(({ pass, onDeactivate }: IProps) => {
  const active = pass.status === PassStatus.ACTIVE
  const handleDeactivate = useCallback(() => onDeactivate(pass.id), [onDeactivate, pass.id])

  return (
    <div testId={`pass-list__row-${pass.id}`} style={row(active)}>
      <div style={avatar(active)}>
        <text style={avatarText(active)}>{initialsOf(pass.holderName)}</text>
      </div>
      <div style={info}>
        <Text variant="bodyStrong">{pass.holderName}</Text>
        <Text variant="caption">{`${ISSUED_PREFIX}${formatIssuedAt(pass.createdAt)}`}</Text>
      </div>
      <div style={actions}>
        <Badge label={PASS_STATUS_LABELS[pass.status]} tone={active ? 'success' : 'muted'} />
        <If condition={active}>
          <Tooltip title={REVOKE_TOOLTIP}>
            <IconButton
              icon="ban"
              testId={`pass-list__deactivate-${pass.id}`}
              onClick={handleDeactivate}
              color={theme.colors.secondary}
              hoverColor={theme.colors.dangerSoft}
            />
          </Tooltip>
        </If>
      </div>
    </div>
  )
})
