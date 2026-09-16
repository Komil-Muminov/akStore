import { memo } from 'react'
import { PASS_STATUS_LABELS, PassStatus, type IPass } from '@/entities/pass'
import { toShortDateTime } from '@/entities/report'
import { Badge, Text } from '@/shared/ui'
import { HOST_PREFIX } from '../model'
import { date, main, row, status } from '../style'

interface IProps {
  pass: IPass
}

const SEPARATOR = ' · '

export const ReportRow = memo(({ pass }: IProps) => {
  const active = pass.status === PassStatus.ACTIVE
  const meta = [`${HOST_PREFIX}${pass.hostName}`, pass.organization, pass.carPlate].filter(Boolean).join(SEPARATOR)

  return (
    <div style={row} testId={`report-table__row-${pass.id}`}>
      <div style={date}>
        <Text variant="secondary">{toShortDateTime(pass.createdAt)}</Text>
      </div>
      <div style={main}>
        <Text variant="bodyStrong">{pass.holderName}</Text>
        <Text variant="caption">{meta}</Text>
      </div>
      <div style={status}>
        <Badge label={PASS_STATUS_LABELS[pass.status]} tone={active ? 'success' : 'muted'} />
      </div>
    </div>
  )
})
