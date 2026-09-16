import { memo, useCallback } from 'react'
import type { IPosition } from '@/entities/position'
import { theme } from '@/shared/config'
import { IconButton, Text, Tooltip } from '@/shared/ui'
import { DELETE_TOOLTIP, RANK_PREFIX } from '../model'
import { row, rowText } from '../style'

interface IProps {
  position: IPosition
  onDelete: (position: IPosition) => void
}

export const PositionRow = memo(({ position, onDelete }: IProps) => {
  const handleDelete = useCallback(() => onDelete(position), [onDelete, position])
  return (
    <div style={row} testId={`positions__row-${position.id}`}>
      <div style={rowText}>
        <Text variant="body">{position.name}</Text>
      </div>
      <Text variant="secondary">{`${RANK_PREFIX}${String(position.rank)}`}</Text>
      <Tooltip title={DELETE_TOOLTIP}>
        <IconButton
          icon="trash"
          onClick={handleDelete}
          color={theme.colors.secondary}
          hoverColor={theme.colors.dangerSoft}
          testId={`positions__delete-${position.id}`}
        />
      </Tooltip>
    </div>
  )
})
