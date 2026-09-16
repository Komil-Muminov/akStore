import { memo, useCallback, useState } from 'react'
import { PassStatus, type IPass } from '@/entities/pass'
import { theme } from '@/shared/config'
import { If, IconButton, Text, Tooltip } from '@/shared/ui'
import { DEACTIVATE_LABEL } from '../model'
import { actions, row, status } from '../style'

interface IProps {
  pass: IPass
  onDeactivate: (id: string) => void
}

export const PassRow = memo(({ pass, onDeactivate }: IProps) => {
  const [hovered, setHovered] = useState(false)
  const active = pass.status === PassStatus.ACTIVE
  const handleEnter = useCallback(() => setHovered(true), [])
  const handleLeave = useCallback(() => setHovered(false), [])
  const handleDeactivate = useCallback(() => onDeactivate(pass.id), [onDeactivate, pass.id])

  return (
    <div
      testId={`pass-list__row-${pass.id}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={row}
    >
      <div style={status(active)} />
      <Text variant={active ? 'body' : 'ghost'} style={{ flexGrow: 1 }}>
        {pass.holderName}
      </Text>
      <If condition={hovered && active}>
        <div style={actions}>
          <Tooltip title={DEACTIVATE_LABEL}>
            <IconButton
              icon="trash"
              testId={`pass-list__deactivate-${pass.id}`}
              onClick={handleDeactivate}
              color={theme.colors.ghost}
            />
          </Tooltip>
        </div>
      </If>
    </div>
  )
})
