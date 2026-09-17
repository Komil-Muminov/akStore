import { PASS_STATUS_LABELS, PassStatus, type IPass } from '@/entities/pass'
import { Badge, Text } from '@/shared/ui'
import { INSIDE_LABEL, OUTSIDE_LABEL } from '../model'
import { card, cardHead, cardText, codeText, detailLabel, detailRow } from '../style'

interface IProps {
  pass: IPass
  inside: boolean
  rows: { label: string; value: string }[]
}

export const PassCard = ({ pass, inside, rows }: IProps) => (
  <div style={card} testId="gate__card">
    <div style={cardHead}>
      <div style={cardText}>
        <text style={codeText}>{pass.code}</text>
        <Text variant="title">{pass.holderName}</Text>
      </div>
      <Badge tone={inside ? 'success' : 'muted'} label={inside ? INSIDE_LABEL : OUTSIDE_LABEL} />
      <Badge
        tone={pass.status === PassStatus.ACTIVE ? 'success' : 'danger'}
        label={PASS_STATUS_LABELS[pass.status]}
      />
    </div>
    {rows.map((row) => (
      <div key={row.label} style={detailRow}>
        <div style={detailLabel}>
          <Text variant="secondary">{row.label}</Text>
        </div>
        <Text variant="bodyStrong">{row.value}</Text>
      </div>
    ))}
  </div>
)
