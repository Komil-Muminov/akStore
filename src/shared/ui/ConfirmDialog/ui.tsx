import { theme } from '@/shared/config'
import { Button, type TButtonVariant } from '../Button'
import { Modal } from '../Modal'
import { Text } from '../Text'
import { actions } from './style'

interface IProps {
  open: boolean
  title: string
  text: string
  confirmLabel: string
  cancelLabel: string
  variant?: TButtonVariant
  pending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  text,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  pending = false,
  onConfirm,
  onCancel,
}: IProps) => (
  <Modal open={open} title={title} icon="ban" iconColor={theme.colors.danger} onClose={onCancel} testId="confirm-dialog">
    <Text variant="body">{text}</Text>
    <div style={actions}>
      <Button label={cancelLabel} variant="secondary" onClick={onCancel} testId="confirm-dialog__cancel" />
      <Button label={confirmLabel} variant={variant} onClick={onConfirm} disabled={pending} testId="confirm-dialog__confirm" />
    </div>
  </Modal>
)
