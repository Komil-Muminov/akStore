import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, FormField, If, Modal, Text, TextInput } from '@/shared/ui'
import {
  ADD_LABEL,
  ADD_SECTION,
  EMPTY_CANDIDATES,
  ESTIMATED_ITEM_HEIGHT,
  MEMBERS_LABEL,
  PANEL_DESCRIPTION,
  PANEL_TITLE,
  READONLY_HINT,
  RENAME_LABEL,
  SEARCH_PLACEHOLDER,
  TITLE_LABEL,
  type IProps,
} from './model'
import { actions, body, empty, list, renameField, renameRow } from './style'
import { CandidateRow } from './ui/CandidateRow'
import { MemberRow } from './ui/MemberRow'

export const ChatGroupPanel = ({
  open,
  title,
  members,
  companions,
  isOwner,
  pending,
  error,
  onRename,
  onAddMembers,
  onRemoveMember,
  onClose,
}: IProps) => {
  const [name, setName] = useState(title)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => setName(title), [title])

  const candidates = useMemo(() => {
    const inside = new Set(members.map((member) => member.userId))
    const needle = query.trim().toLowerCase()
    return companions.filter(
      (companion) =>
        !inside.has(companion.userId) &&
        (companion.fullName.toLowerCase().includes(needle) || companion.login.toLowerCase().includes(needle)),
    )
  }, [companions, members, query])

  const handleToggle = useCallback((userId: string) => {
    setSelected((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId],
    )
  }, [])

  const handleRename = useCallback(() => onRename(name.trim()), [name, onRename])
  const handleAdd = useCallback(() => {
    onAddMembers(selected)
    setSelected([])
  }, [onAddMembers, selected])

  return (
    <Modal
      open={open}
      title={PANEL_TITLE}
      description={PANEL_DESCRIPTION}
      icon="userCog"
      onClose={onClose}
      testId="chat__group-panel"
    >
      <div style={body}>
        <div style={renameRow}>
          <div style={renameField}>
            <FormField
              label={TITLE_LABEL}
              value={name}
              onChange={setName}
              onSubmit={handleRename}
              testId="chat__group-rename"
            />
          </div>
          <Button
            label={RENAME_LABEL}
            variant="secondary"
            onClick={handleRename}
            disabled={!isOwner || pending || name.trim().length === 0 || name.trim() === title}
          />
        </div>
        <Text variant="label">{MEMBERS_LABEL}</Text>
        <div style={list}>
          {members.map((member) => (
            <MemberRow
              key={member.userId}
              member={member}
              isOwner={false}
              canRemove={isOwner}
              onRemove={onRemoveMember}
            />
          ))}
        </div>
        <If condition={isOwner} fallback={<Text variant="caption">{READONLY_HINT}</Text>}>
          <>
            <Text variant="label">{ADD_SECTION}</Text>
            <TextInput value={query} onChange={setQuery} placeholder={SEARCH_PLACEHOLDER} icon="search" />
            <If
              condition={candidates.length > 0}
              fallback={
                <div style={empty}>
                  <Text variant="secondary">{EMPTY_CANDIDATES}</Text>
                </div>
              }
            >
              <virtual-list estimatedItemHeight={ESTIMATED_ITEM_HEIGHT} style={list} testId="chat__group-candidates">
                {candidates.map((companion) => (
                  <CandidateRow
                    key={companion.userId}
                    companion={companion}
                    checked={selected.includes(companion.userId)}
                    onToggle={handleToggle}
                  />
                ))}
              </virtual-list>
            </If>
          </>
        </If>
        <If condition={error !== undefined}>
          <Text variant="danger">{error ?? ''}</Text>
        </If>
        <div style={actions}>
          <Button
            label={ADD_LABEL}
            icon="plus"
            onClick={handleAdd}
            disabled={!isOwner || pending || selected.length === 0}
            testId="chat__group-add"
          />
        </div>
      </div>
    </Modal>
  )
}
