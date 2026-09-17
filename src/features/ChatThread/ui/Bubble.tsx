import { useCallback } from 'react'
import { DELETED_BODY, EDITED_MARK, hasFile, timeOf, type IMessage } from '@/entities/message'
import { theme } from '@/shared/config'
import { Icon, IconButton, If, Tooltip } from '@/shared/ui'
import { EDIT_TOOLTIP, REMOVE_TOOLTIP } from '../model'
import {
  authorLabel,
  bodyOf,
  bubbleActions,
  bubbleOf,
  deletedBody,
  metaInfo,
  metaOf,
  metaRow,
  rowOf,
} from '../style'
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
  const handleEdit = useCallback(() => onEdit(message), [message, onEdit])
  const handleRemove = useCallback(() => onRemove(message), [message, onRemove])
  const canRemove = own && !message.isDeleted
  const canEdit = own && !message.isDeleted && !hasFile(message)

  return (
    <div style={rowOf(own)} testId={`chat__message-${message.id}`}>
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
          <If condition={canRemove}>
            <div style={bubbleActions}>
              <If condition={canEdit}>
                <Tooltip title={EDIT_TOOLTIP}>
                  <IconButton
                    icon="pencil"
                    size="sm"
                    onClick={handleEdit}
                    color={own ? theme.colors.onAccent : theme.colors.secondary}
                    hoverColor={theme.colors.overlayStrong}
                    testId={`chat__edit-${message.id}`}
                  />
                </Tooltip>
              </If>
              <Tooltip title={REMOVE_TOOLTIP}>
                <IconButton
                  icon="trash"
                  size="sm"
                  onClick={handleRemove}
                  color={own ? theme.colors.onAccent : theme.colors.danger}
                  hoverColor={theme.colors.dangerSoft}
                  testId={`chat__remove-${message.id}`}
                />
              </Tooltip>
            </div>
          </If>
          <div style={metaInfo}>
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
    </div>
  )
}
