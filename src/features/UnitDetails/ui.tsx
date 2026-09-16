import { useCallback, useMemo } from 'react'
import { CHILD_TYPE, UNIT_TYPE_LABELS, UnitType, childrenOf, unitPath } from '@/entities/unit'
import { theme } from '@/shared/config'
import { Button, Icon, IconButton, If, Text } from '@/shared/ui'
import {
  ADD_CHILD_PREFIX,
  CHILDREN_LABEL,
  DELETE_LABEL,
  EDIT_POSITIONS_LABEL,
  NO_POSITIONS,
  PATH_LABEL,
  PATH_SEPARATOR,
  POSITIONS_LABEL,
  RENAME_LABEL,
  TITLE,
  type IProps,
} from './model'
import { actions, block, card, chipRow, head, root, spacer, typeRow } from './style'

const TYPE_COLORS: Record<UnitType, string> = {
  [UnitType.LEADERSHIP]: theme.colors.accent,
  [UnitType.MANAGEMENT]: theme.colors.info,
  [UnitType.DEPARTMENT]: '#A78BFA',
  [UnitType.SECTION]: '#FBBF24',
}

export const UnitDetails = ({ unit, units, positions, users, pending, onAddChild, onRename, onEditPositions, onDelete, onClose }: IProps) => {
  const childType = CHILD_TYPE[unit.type]
  const locked = unit.type === UnitType.LEADERSHIP
  const path = useMemo(() => unitPath(units, unit.parentId).join(PATH_SEPARATOR), [units, unit.parentId])
  const childrenCount = useMemo(() => childrenOf(units, unit.id).length, [units, unit.id])
  const assignedItems = useMemo(() => {
    if (!unit.assignments || unit.assignments.length === 0) {
      return unit.positionIds
        .map((id) => {
          const pos = positions.find((p) => p.id === id)
          return { id, posName: pos?.name ?? '', userName: null }
        })
        .filter((item) => item.posName)
    }
    return unit.assignments
      .map((item) => {
        const pos = positions.find((p) => p.id === item.positionId)
        const usr = users.find((u) => u.id === item.userId)
        return {
          id: item.positionId,
          posName: pos?.name ?? '',
          userName: usr ? usr.fullName || usr.login : null,
        }
      })
      .filter((item) => item.posName)
  }, [unit.assignments, unit.positionIds, positions, users])
  const handleAddChild = useCallback(() => onAddChild(unit), [onAddChild, unit])
  const handleRename = useCallback(() => onRename(unit), [onRename, unit])
  const handlePositions = useCallback(() => onEditPositions(unit), [onEditPositions, unit])
  const handleDelete = useCallback(() => onDelete(unit), [onDelete, unit])

  return (
    <div style={root} testId="unit-details" onScroll={() => {}}>
      <div style={head}>
        <Text variant="title">{TITLE}</Text>
        <div style={spacer} />
        <IconButton icon="x" onClick={onClose} testId="unit-details__close" />
      </div>
      <div style={block}>
        <div style={chipRow}>
          <div style={typeRow(TYPE_COLORS[unit.type])}>
            <Text variant="label">{UNIT_TYPE_LABELS[unit.type]}</Text>
          </div>
        </div>
        <Text variant="heading">{unit.name}</Text>
        <If condition={path.length > 0}>
          <Text variant="caption">{`${PATH_LABEL}: ${path}`}</Text>
        </If>
        <Text variant="caption">{`${CHILDREN_LABEL}: ${String(childrenCount)}`}</Text>
      </div>
      <div style={card}>
        <div style={chipRow}>
          <Icon name="briefcase" size={theme.size.iconMd} color={theme.colors.tertiary} />
          <Text variant="label">{POSITIONS_LABEL}</Text>
        </div>
        <If condition={assignedItems.length > 0} fallback={<Text variant="ghost">{NO_POSITIONS}</Text>}>
          {assignedItems.map((item) => (
            <Text key={item.id} variant="body">
              {`• ${item.posName}${item.userName ? ` — ${item.userName}` : ' (вакансия)'}`}
            </Text>
          ))}
        </If>
        <Button label={EDIT_POSITIONS_LABEL} icon="briefcase" variant="secondary" fullWidth onClick={handlePositions} testId="unit-details__positions" />
      </div>
      <div style={spacer} />
      <div style={actions}>
        <If condition={childType !== null}>
          <Button
            label={`${ADD_CHILD_PREFIX}${UNIT_TYPE_LABELS[childType ?? UnitType.SECTION].toLowerCase()}`}
            icon="plus"
            fullWidth
            onClick={handleAddChild}
            testId="unit-details__add-child"
          />
        </If>
        <Button label={RENAME_LABEL} icon="pencil" variant="secondary" fullWidth onClick={handleRename} testId="unit-details__rename" />
        <If condition={!locked}>
          <Button label={DELETE_LABEL} icon="trash" variant="danger" fullWidth onClick={handleDelete} disabled={pending} testId="unit-details__delete" />
        </If>
      </div>
    </div>
  )
}
