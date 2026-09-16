import { theme } from '@/shared/config'
import { Icon, Text } from '@/shared/ui'
import { TILES, type IProps } from './model'
import { root, tile, tileHead, value } from './style'

export const ReportSummary = ({ summary }: IProps) => (
  <div style={root} testId="report-summary">
    {TILES.map((spec) => (
      <div key={spec.key} style={tile} testId={`report-summary__${spec.key}`}>
        <div style={tileHead}>
          <Icon name={spec.icon} size={theme.size.iconMd} color={theme.colors.tertiary} />
          <Text variant="label">{spec.label}</Text>
        </div>
        <text style={value}>{String(summary[spec.key])}</text>
        <Text variant="caption">{spec.hint}</Text>
      </div>
    ))}
  </div>
)
