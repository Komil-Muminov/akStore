import type { IHost } from '@/entities/host'
import type { IMessage } from '@/entities/message'
import { ChatGroupForm, type IGroupSubmit } from '@/features/ChatGroupForm'
import { ConfirmDialog } from '@/shared/ui'
import { REMOVE_DIALOG } from '../model'

interface IProps {
  groupOpen: boolean
  colleagues: IHost[]
  groupPending: boolean
  groupError?: string
  removing: IMessage | null
  removePending: boolean
  onCreateGroup: (values: IGroupSubmit) => void
  onCloseGroup: () => void
  onConfirmRemove: () => void
  onCancelRemove: () => void
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
