import { useCallback, useState } from 'react'
import { DELETED_BODY, EDITED_MARK, hasFile, timeOf, type IMessage } from '@/entities/message'
import { theme } from '@/shared/config'
import { Icon, IconButton, If } from '@/shared/ui'
import { bodyOf, bubbleOf, metaOf, metaRow, rowOf } from '../style'
import { authorLabel, bubbleActions, deletedBody } from '../style.chrome'
import { FileCard } from './FileCard'

interface IProps {
  message: IMessage
  own: boolean
  showAuthor: boolean
  read: boolean
  showStatus: boolean
  onEdit: (message: IMessage) => void
  onRemove: (message: IMessage) => void
  onDownload: (message: IMessage) => void
  maxWidth: number
}

export const Bubble = ({
  message,
  own,
  showAuthor,
  read,
  showStatus,
  onEdit,
  onRemove,
  onDownload,
  maxWidth,
}: IProps) => {
  const [hovered, setHovered] = useState(false)
  const handleEnter = useCallback(() => setHovered(true), [])
  const handleLeave = useCallback(() => setHovered(false), [])
  const handleEdit = useCallback(() => onEdit(message), [message, onEdit])
  const handleRemove = useCallback(() => onRemove(message), [message, onRemove])
  const editable = own && !message.isDeleted && !hasFile(message)

  return (
    <div
      style={rowOf(own)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      testId={`chat__message-${message.id}`}
    >
      <If condition={editable && hovered}>
        <div style={bubbleActions}>
          <IconButton icon="pencil" onClick={handleEdit} testId={`chat__edit-${message.id}`} />
          <IconButton
            icon="trash"
            onClick={handleRemove}
            hoverColor={theme.colors.dangerSoft}
            testId={`chat__remove-${message.id}`}
          />
        </div>
      </If>
      <div style={bubbleOf(own, hasFile(message), maxWidth)}>
        <If condition={showAuthor}>
          <text style={authorLabel}>{message.authorName}</text>
        </If>
        <If condition={hasFile(message)}>
          <FileCard message={message} own={own} onDownload={onDownload} />
        </If>
        <If condition={message.isDeleted} fallback={<If condition={message.body.length > 0}>
          <text style={bodyOf(own)}>{message.body}</text>
        </If>}>
          <text style={deletedBody}>{DELETED_BODY}</text>
        </If>
        <div style={metaRow}>
          <If condition={message.editedAt !== null && !message.isDeleted}>
            <text style={metaOf(own)}>{EDITED_MARK}</text>
          </If>
          <text style={metaOf(own)}>{timeOf(message.createdAt)}</text>
          <If condition={showStatus && !message.isDeleted}>
            <Icon name={read ? 'checkCheck' : 'check'} size={theme.size.iconSm} color={theme.colors.onAccent} />
          </If>
        </div>
      </div>
    </div>
  )
}
