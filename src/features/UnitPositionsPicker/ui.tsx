import { useCallback, useEffect, useMemo, useState } from 'react'
import type { IUnitAssignment } from '@/entities/unit'
import { POSITION_NAME_MIN_LENGTH } from '@/entities/position'
import { Button, Checkbox, If, Modal, Text, TextInput } from '@/shared/ui'
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
import { emptyWrap, footer, formRow, inputWrap, itemCard, itemWrapper, list, selectRow, selectStyle, spacer } from './style'

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
  const [assignments, setAssignments] = useState<Record<string, string | null>>({})
  const [newPositionName, setNewPositionName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const open = unit !== null

  useEffect(() => {
    if (!open || !unit) return
    const map: Record<string, string | null> = {}
    if (unit.assignments && unit.assignments.length > 0) {
      unit.assignments.forEach((item) => {
        map[item.positionId] = item.userId
      })
    } else {
      unit.positionIds.forEach((id) => {
        map[id] = null
      })
    }
    setAssignments(map)
  }, [open, unit])

  const filteredPositions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return q ? positions.filter((p) => p.name.toLowerCase().includes(q)) : positions
  }, [positions, searchQuery])

  const toggle = useCallback((positionId: string) => {
    setAssignments((current) => {
      const next = { ...current }
      if (positionId in next) {
        delete next[positionId]
      } else {
        next[positionId] = null
      }
      return next
    })
  }, [])

  const handleSelectUser = useCallback((positionId: string, userId: string | null) => {
    setAssignments((current) => ({ ...current, [positionId]: userId }))
  }, [])

  const handleCreatePosition = useCallback(async () => {
    const trimmed = newPositionName.trim()
    if (trimmed.length < POSITION_NAME_MIN_LENGTH) return
    setNewPositionName('')
    const created = await onCreatePosition({ name: trimmed })
    if (created && 'id' in created) {
      setAssignments((current) => ({ ...current, [created.id]: null }))
    }
  }, [newPositionName, onCreatePosition])

  const handleSubmit = useCallback(() => {
    if (pending) return
    const result: IUnitAssignment[] = positions
      .filter((position) => position.id in assignments)
      .map((position) => ({ positionId: position.id, userId: assignments[position.id] ?? null }))
    onSubmit(result)
  }, [pending, onSubmit, positions, assignments])

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
            return (
              <div key={position.id} style={itemWrapper}>
                <div style={itemCard}>
                  <Checkbox
                    label={position.name}
                    checked={isChecked}
                    onToggle={() => toggle(position.id)}
                    testId={`unit-positions__item-${position.id}`}
                  />
                  <If condition={isChecked}>
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
