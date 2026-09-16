import { useMemo } from 'react'
import { POSITION_NAME_MIN_LENGTH } from '@/entities/position'
import { ROLE_LABELS, UserRole } from '@/entities/user'
import { Button, Checkbox, If, Modal, Select, Text, TextInput, type ISelectOption } from '@/shared/ui'
import { useUnitPositionsPicker } from './hooks'
import {
  ADD_POSITION_LABEL,
  CANCEL_LABEL,
  DESCRIPTION,
  EMPLOYEE_LABEL,
  EMPLOYEE_PLACEHOLDER,
  EMPTY,
  ESTIMATED_ITEM_HEIGHT,
  NEW_POSITION_PLACEHOLDER,
  SEARCH_EMPTY,
  SEARCH_POSITION_PLACEHOLDER,
  SUBMIT_LABEL,
  TITLE,
  type IProps,
} from './model'
import { emptyWrap, footer, formRow, inputWrap, itemCard, itemLeft, itemWrapper, list, selectRow, spacer } from './style'

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
    filteredPositions,
    toggle,
    handleSelectUser,
    handleCreatePosition,
    handleSubmit,
  } = useUnitPositionsPicker(unit, positions, onCreatePosition, onSubmit, pending)

  const userOptions = useMemo<ISelectOption[]>(
    () =>
      users
        .filter((user) => user.role !== UserRole.SUPERADMIN && user.isActive)
        .map((user) => ({ id: user.id, label: user.fullName || user.login, description: `${ROLE_LABELS[user.role]} · @${user.login}`, keywords: [user.login] })),
    [users],
  )

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
                  <div style={itemLeft}>
                    <Checkbox
                      label={position.name}
                      checked={isChecked}
                      onToggle={() => toggle(position.id)}
                      testId={`unit-positions__item-${position.id}`}
                    />
                  </div>
                  <If condition={isChecked}>
                    <div style={selectRow}>
                      <Text variant="caption">{EMPLOYEE_LABEL}</Text>
                      <Select
                        value={assignments[position.id] ?? null}
                        options={userOptions}
                        onChange={(userId) => handleSelectUser(position.id, userId)}
                        placeholder={EMPLOYEE_PLACEHOLDER}
                        icon="user"
                        testId={`unit-positions__employee-${position.id}`}
                      />
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
