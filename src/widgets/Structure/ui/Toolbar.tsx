import { Button, Text } from '@/shared/ui'
import { ADD_MANAGEMENT_LABEL, AUTO_LAYOUT_LABEL, DESCRIPTION, POSITIONS_LABEL, TITLE } from '../model'
import { actions, header, headerText } from '../style'

interface IProps {
  canAddManagement: boolean
  onAddManagement: () => void
  onAutoLayout: () => void
}

export const Toolbar = ({ canAddManagement, onAddManagement, onAutoLayout }: IProps) => (
  <div style={header}>
    <div style={headerText}>
      <Text variant="heading">{TITLE}</Text>
      <Text variant="secondary">{DESCRIPTION}</Text>
    </div>
    <div style={actions}>
      <Button label={ADD_MANAGEMENT_LABEL} icon="plus" onClick={onAddManagement} disabled={!canAddManagement} testId="structure__add" />
      <Button label={AUTO_LAYOUT_LABEL} icon="rotate" variant="secondary" onClick={onAutoLayout} testId="structure__auto-layout" />
    </div>
  </div>
)
