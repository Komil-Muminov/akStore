import type { TBadgeTone } from './model'
import { dot, root, text } from './style'

interface IProps {
  label: string
  tone: TBadgeTone
  testId?: string
}

export const Badge = ({ label, tone, testId }: IProps) => (
  <div style={root(tone)} testId={testId}>
    <div style={dot(tone)} />
    <text style={text(tone)}>{label}</text>
  </div>
)
