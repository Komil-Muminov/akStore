import { theme } from '@/shared/config'
import { If, Text } from '@/shared/ui'
import {
  ACTION_LABELS,
  CREATE_LABEL,
  ESTIMATED_ROW_HEIGHT,
  FAILED_LABEL,
  ImportAction,
  PREVIEW_LIMIT,
  TOTAL_LABEL,
  UPDATE_LABEL,
  type IImportPreview,
} from '../model'
import { list, row, rowName, stat, statValue, stats } from '../style'

interface IProps {
  preview: IImportPreview
}

const TONES: Record<ImportAction, string> = {
  [ImportAction.CREATE]: theme.colors.accentHover,
  [ImportAction.UPDATE]: theme.colors.info,
  [ImportAction.FAILED]: theme.colors.danger,
}

export const PreviewList = ({ preview }: IProps) => (
  <>
    <div style={stats}>
      <div style={stat}>
        <Text variant="caption">{TOTAL_LABEL}</Text>
        <text style={statValue(theme.colors.text)}>{String(preview.total)}</text>
      </div>
      <div style={stat}>
        <Text variant="caption">{CREATE_LABEL}</Text>
        <text style={statValue(theme.colors.accentHover)}>{String(preview.toCreate)}</text>
      </div>
      <div style={stat}>
        <Text variant="caption">{UPDATE_LABEL}</Text>
        <text style={statValue(theme.colors.info)}>{String(preview.toUpdate)}</text>
      </div>
      <div style={stat}>
        <Text variant="caption">{FAILED_LABEL}</Text>
        <text style={statValue(preview.failed > 0 ? theme.colors.danger : theme.colors.secondary)}>
          {String(preview.failed)}
        </text>
      </div>
    </div>
    <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="import__rows">
      {preview.rows.slice(0, PREVIEW_LIMIT).map((entry) => (
        <div key={entry.line} style={row}>
          <div style={rowName}>
            <Text variant="body">{entry.values.name.length > 0 ? entry.values.name : `Строка ${String(entry.line)}`}</Text>
            <If condition={entry.error.length > 0}>
              <Text variant="danger">{entry.error}</Text>
            </If>
          </div>
          <text style={statValue(TONES[entry.action])}>{ACTION_LABELS[entry.action]}</text>
        </div>
      ))}
    </virtual-list>
  </>
)
