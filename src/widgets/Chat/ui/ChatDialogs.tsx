import type { IColleague, IMember, IMessage } from '@/entities/message'
import { ChatGroupPanel } from '@/features/ChatGroupPanel'
import { ChatGroupForm, type IGroupSubmit } from '@/features/ChatGroupForm'
import { ConfirmDialog } from '@/shared/ui'
import { REMOVE_DIALOG } from '../model'

interface IProps {
  groupOpen: boolean
  colleagues: IColleague[]
  groupPending: boolean
  groupError?: string
  removing: IMessage | null
  removePending: boolean
  onCreateGroup: (values: IGroupSubmit) => void
  onCloseGroup: () => void
  onConfirmRemove: () => void
  onCancelRemove: () => void
  panelOpen: boolean
  panelTitle: string
  members: IMember[]
  isOwner: boolean
  panelPending: boolean
  panelError?: string
  onRename: (title: string) => void
  onAddMembers: (memberIds: string[]) => void
  onRemoveMember: (memberId: string) => void
  onClosePanel: () => void
}

export const ChatDialogs = ({
  groupOpen,
  colleagues,
  groupPending,
  groupError,
  removing,
  removePending,
  onCreateGroup,
  onCloseGroup,
  onConfirmRemove,
  onCancelRemove,
  panelOpen,
  panelTitle,
  members,
  isOwner,
  panelPending,
  panelError,
  onRename,
  onAddMembers,
  onRemoveMember,
  onClosePanel,
}: IProps) => (
  <>
    <ChatGroupForm
      open={groupOpen}
      companions={colleagues}
      pending={groupPending}
      error={groupError}
      onSubmit={onCreateGroup}
      onClose={onCloseGroup}
    />
    <ChatGroupPanel
      open={panelOpen}
      title={panelTitle}
      members={members}
      companions={colleagues}
      isOwner={isOwner}
      pending={panelPending}
      error={panelError}
      onRename={onRename}
      onAddMembers={onAddMembers}
      onRemoveMember={onRemoveMember}
      onClose={onClosePanel}
    />
    <ConfirmDialog
      open={removing !== null}
      title={REMOVE_DIALOG.title}
      text={REMOVE_DIALOG.text}
      confirmLabel={REMOVE_DIALOG.confirm}
      cancelLabel={REMOVE_DIALOG.cancel}
      pending={removePending}
      onConfirm={onConfirmRemove}
      onCancel={onCancelRemove}
    />
  </>
)
