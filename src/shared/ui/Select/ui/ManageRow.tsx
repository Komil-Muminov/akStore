import { useCallback } from 'react'
import { theme } from '@/shared/config'
import { IconButton } from '../../IconButton'
import { If } from '../../If'
import { TextInput } from '../../TextInput'
import { Tooltip } from '../../Tooltip'
import { CANCEL_TOOLTIP, CONFIRM_TOOLTIP, REMOVE_TOOLTIP, SAVE_TOOLTIP, type ISelectOption } from '../model'
import { manageField, manageRow } from '../style.manage'

interface IProps {
  option: ISelectOption
  draft: string
  confirming: boolean
  onDraftChange: (value: string) => void
  onSave: () => void
  onAskRemove: () => void
  onCancelRemove: () => void
  onConfirmRemove: () => void
}

export const ManageRow = ({
  option,
  draft,
  confirming,
  onDraftChange,
  onSave,
  onAskRemove,
  onCancelRemove,
  onConfirmRemove,
}: IProps) => {
  const handleSave = useCallback(() => onSave(), [onSave])

  return (
    <div style={manageRow}>
      <div style={manageField}>
        <TextInput value={draft} onChange={onDraftChange} testId={`select__manage-${option.id}`} />
      </div>
      <If
        condition={confirming}
        fallback={
          <>
            <Tooltip title={SAVE_TOOLTIP}>
              <IconButton
                icon="check"
                size="sm"
                onClick={handleSave}
                color={theme.colors.accent}
                testId={`select__save-${option.id}`}
              />
            </Tooltip>
            <Tooltip title={REMOVE_TOOLTIP}>
              <IconButton
                icon="trash"
                size="sm"
                onClick={onAskRemove}
                color={theme.colors.danger}
                hoverColor={theme.colors.dangerSoft}
                testId={`select__remove-${option.id}`}
              />
            </Tooltip>
          </>
        }
      >
        <Tooltip title={CONFIRM_TOOLTIP}>
          <IconButton
            icon="trash"
            size="sm"
            onClick={onConfirmRemove}
            color={theme.colors.danger}
            hoverColor={theme.colors.dangerSoft}
            testId={`select__remove-confirm-${option.id}`}
          />
        </Tooltip>
        <Tooltip title={CANCEL_TOOLTIP}>
          <IconButton icon="x" size="sm" onClick={onCancelRemove} testId={`select__remove-cancel-${option.id}`} />
        </Tooltip>
      </If>
    </div>
  )
}
