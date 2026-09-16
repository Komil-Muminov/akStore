import { useCallback, useMemo, useState } from 'react'
import { membersLabelOf } from '@/entities/message'
import { Button, FormField, If, Modal, Text, TextInput } from '@/shared/ui'
import {
  CANCEL_LABEL,
  EMPTY_RESULT,
  ESTIMATED_ITEM_HEIGHT,
  HINT,
  MEMBERS_LABEL,
  MIN_MEMBERS,
  MODAL_DESCRIPTION,
  MODAL_TITLE,
  SEARCH_PLACEHOLDER,
  SUBMIT_LABEL,
  TITLE_LABEL,
  TITLE_PLACEHOLDER,
  type IProps,
} from './model'
import { actions, body, empty, errorRow, list, membersHead } from './style'
import { MemberItem } from './ui/MemberItem'

export const ChatGroupForm = ({ open, companions, pending, error, onSubmit, onClose }: IProps) => {
  const [title, setTitle] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const found = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return companions.filter(
      (companion) =>
        companion.fullName.toLowerCase().includes(needle) || companion.login.toLowerCase().includes(needle),
    )
  }, [companions, query])

  const ready = title.trim().length > 0 && selected.length >= MIN_MEMBERS && !pending

  const handleToggle = useCallback((userId: string) => {
    setSelected((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId],
    )
  }, [])

  const handleClose = useCallback(() => {
    setTitle('')
    setQuery('')
    setSelected([])
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(() => {
    if (!ready) return
    onSubmit({ title: title.trim(), memberIds: selected })
  }, [ready, title, selected, onSubmit])

  return (
    <Modal
      open={open}
      title={MODAL_TITLE}
      description={MODAL_DESCRIPTION}
      icon="users"
      onClose={handleClose}
      testId="chat__group-form"
    >
      <div style={body}>
        <FormField
          label={TITLE_LABEL}
          value={title}
          onChange={setTitle}
          placeholder={TITLE_PLACEHOLDER}
          isRequired
          testId="chat__group-title"
        />
        <div style={membersHead}>
          <Text variant="label">{MEMBERS_LABEL}</Text>
          <Text variant="caption">{selected.length > 0 ? membersLabelOf(selected.length) : HINT}</Text>
        </div>
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder={SEARCH_PLACEHOLDER}
          icon="search"
          testId="chat__group-search"
        />
        <If
          condition={found.length > 0}
          fallback={
            <div style={empty}>
              <Text variant="secondary">{EMPTY_RESULT}</Text>
            </div>
          }
        >
          <virtual-list estimatedItemHeight={ESTIMATED_ITEM_HEIGHT} style={list} testId="chat__group-members">
            {found.map((companion) => (
              <MemberItem
                key={companion.userId}
                companion={companion}
                checked={selected.includes(companion.userId)}
                onToggle={handleToggle}
              />
            ))}
          </virtual-list>
        </If>
        <If condition={error !== undefined}>
          <div style={errorRow}>
            <Text variant="danger">{error ?? ''}</Text>
          </div>
        </If>
        <div style={actions}>
          <Button label={CANCEL_LABEL} variant="secondary" onClick={handleClose} />
          <Button label={SUBMIT_LABEL} icon="users" onClick={handleSubmit} disabled={!ready} testId="chat__group-submit" />
        </div>
      </div>
    </Modal>
  )
}
