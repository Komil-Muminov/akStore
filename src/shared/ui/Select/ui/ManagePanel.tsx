import { theme } from '@/shared/config'
import { Icon } from '../../Icon'
import { If } from '../../If'
import { Text } from '../../Text'
import { CREATE_PREFIX, MANAGE_DONE_LABEL, MANAGE_LABEL, type ISelectOption } from '../model'
import { createRow, footer, manageList } from '../style.manage'
import { ManageRow } from './ManageRow'

interface IProps {
  options: ISelectOption[]
  managing: boolean
  drafts: Record<string, string>
  confirmId: string | null
  newName: string
  onToggleManage: () => void
  onDraftChange: (id: string, value: string) => void
  onSave: (id: string) => void
  onAskRemove: (id: string) => void
  onCancelRemove: () => void
  onConfirmRemove: (id: string) => void
  onCreate: () => void
}

export const ManagePanel = ({
  options,
  managing,
  drafts,
  confirmId,
  newName,
  onToggleManage,
  onDraftChange,
  onSave,
  onAskRemove,
  onCancelRemove,
  onConfirmRemove,
  onCreate,
}: IProps) => (
  <div style={manageList}>
    <If condition={managing}>
      {options.map((option) => (
        <ManageRow
          key={option.id}
          option={option}
          draft={drafts[option.id] ?? option.label}
          confirming={confirmId === option.id}
          onDraftChange={(value) => onDraftChange(option.id, value)}
          onSave={() => onSave(option.id)}
          onAskRemove={() => onAskRemove(option.id)}
          onCancelRemove={onCancelRemove}
          onConfirmRemove={() => onConfirmRemove(option.id)}
        />
      ))}
    </If>
    <If condition={newName.trim().length > 0}>
      <div style={createRow} onClick={onCreate} testId="select__create">
        <Icon name="plus" size={theme.size.iconMd} color={theme.colors.accent} />
        <Text variant="body">{`${CREATE_PREFIX} «${newName.trim()}»`}</Text>
      </div>
    </If>
    <div style={footer} onClick={onToggleManage} testId="select__manage-toggle">
      <Text variant="caption">{managing ? MANAGE_DONE_LABEL : MANAGE_LABEL}</Text>
      <Icon name={managing ? 'check' : 'pencil'} size={theme.size.iconSm} color={theme.colors.secondary} />
    </div>
  </div>
)
