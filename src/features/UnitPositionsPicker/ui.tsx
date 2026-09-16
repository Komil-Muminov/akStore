import { useMemo } from 'react'
import { POSITION_NAME_MIN_LENGTH } from '@/entities/position'
import { Button, Checkbox, If, Modal, Text, TextInput } from '@/shared/ui'
import { useUnitPositionsPicker } from './hooks'
import {
  ADD_POSITION_LABEL,
  CANCEL_LABEL,
  DESCRIPTION,
  EMPLOYEE_LABEL,
  EMPTY,
  ESTIMATED_ITEM_HEIGHT,
  NEW_POSITION_PLACEHOLDER,
  NO_EMPLOYEE,
  SEARCH_EMPTY,
  SEARCH_POSITION_PLACEHOLDER,
  SUBMIT_LABEL,
  TITLE,
  type IProps,
} from './model'
import { emptyWrap, footer, formRow, inputWrap, itemCard, itemLeft, itemWrapper, list, selectRow, selectStyle, spacer } from './style'

export const UnitPositionsPicker = ({
  unit,
  positions,
  users,
  pending,
  error,
  onCreatePosition,
  onSubmit,
  onClose,
}: IProps) => {
  const {
    open,
    assignments,
    newPositionName,
    setNewPositionName,
    searchQuery,
    setSearchQuery,
    hoveredId,
    setHoveredId,
    filteredPositions,
    toggle,
    handleSelectUser,
    handleCreatePosition,
    handleSubmit,
  } = useUnitPositionsPicker(unit, positions, onCreatePosition, onSubmit, pending)

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  return (
    <Modal
      open={open}
      title={TITLE}
      description={unit ? `${unit.name}. ${DESCRIPTION}` : DESCRIPTION}
      icon="briefcase"
      onClose={onClose}
      testId="unit-positions"
    >
      <div style={formRow}>
        <div style={inputWrap}>
          <TextInput
            value={newPositionName}
            onChange={setNewPositionName}
            onSubmit={handleCreatePosition}
            placeholder={NEW_POSITION_PLACEHOLDER}
            icon="briefcase"
            testId="unit-positions__new-name"
          />
        </div>
        <Button
          label={ADD_POSITION_LABEL}
          icon="plus"
          onClick={handleCreatePosition}
          disabled={newPositionName.trim().length < POSITION_NAME_MIN_LENGTH}
          testId="unit-positions__new-add"
        />
      </div>
      <div style={formRow}>
        <div style={inputWrap}>
          <TextInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={SEARCH_POSITION_PLACEHOLDER}
            icon="search"
            testId="unit-positions__search"
          />
        </div>
      </div>
      <If
        condition={filteredPositions.length > 0}
        fallback={
          <div style={emptyWrap}>
            <Text variant="secondary">{searchQuery.trim() ? SEARCH_EMPTY : EMPTY}</Text>
          </div>
        }
      >
        <virtual-list estimatedItemHeight={ESTIMATED_ITEM_HEIGHT} style={list} testId="unit-positions__list">
          {filteredPositions.map((position) => {
            const isChecked = position.id in assignments
            const isHovered = hoveredId === position.id
            const assignedUser = assignments[position.id] ? userMap.get(assignments[position.id]!) : undefined
            const assignedName = assignedUser?.fullName || assignedUser?.login || ''
            return (
              <div
                key={position.id}
                style={itemWrapper}
                onMouseEnter={() => setHoveredId(position.id)}
                onMouseLeave={() => setHoveredId((cur) => (cur === position.id ? null : cur))}
              >
                <div style={itemCard}>
                  <div style={itemLeft}>
                    <Checkbox
                      label={position.name}
                      checked={isChecked}
                      onToggle={() => toggle(position.id)}
                      testId={`unit-positions__item-${position.id}`}
                    />
                    <If condition={assignedName.length > 0 && !isHovered}>
                      <Text variant="caption">{`· ${assignedName}`}</Text>
                    </If>
                  </div>
                  <If condition={isChecked && isHovered}>
                    <div style={selectRow}>
                      <Text variant="caption">{EMPLOYEE_LABEL}</Text>
                      <select
                        value={assignments[position.id] ?? ''}
                        onChange={(e) => handleSelectUser(position.id, e.target.value || null)}
                        style={selectStyle}
                      >
                        <option value="">{NO_EMPLOYEE}</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.fullName || user.login}
                          </option>
                        ))}
                      </select>
                    </div>
                  </If>
                </div>
              </div>
            )
          })}
        </virtual-list>
      </If>
      <div style={footer}>
        <div style={spacer}>
          <If condition={error !== undefined}>
            <Text variant="danger">{error ?? ''}</Text>
          </If>
        </div>
        <Button label={CANCEL_LABEL} variant="secondary" onClick={onClose} testId="unit-positions__cancel" />
        <Button label={SUBMIT_LABEL} icon="check" onClick={handleSubmit} disabled={pending} testId="unit-positions__submit" />
      </div>
    </Modal>
  )
}
