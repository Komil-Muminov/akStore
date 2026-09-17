import { FISCAL_OFFLINE_LABEL, FISCAL_OFF_LABEL, FISCAL_ONLINE_LABEL } from '@/entities/sale'
import { If, Text, Tooltip } from '@/shared/ui'
import { DEVICE_LABEL, QUEUE_LABEL, UNKNOWN_DEVICE, type IProps } from './model'
import { dotIdle, dotOffline, dotOnline, root } from './style'

const dotOf = (enabled: boolean, online: boolean) => (!enabled ? dotIdle : online ? dotOnline : dotOffline)

const labelOf = (enabled: boolean, online: boolean) =>
  !enabled ? FISCAL_OFF_LABEL : online ? FISCAL_ONLINE_LABEL : FISCAL_OFFLINE_LABEL

export const FiscalBadge = ({ status }: IProps) => {
  const enabled = status?.enabled ?? false
  const online = status?.online ?? false
  const device = status?.device.trim() ?? ''
  const pending = status?.pending ?? 0

  return (
    <Tooltip title={`${DEVICE_LABEL}: ${device.length > 0 ? device : UNKNOWN_DEVICE}`}>
      <div style={root} testId="fiscal__badge">
        <div style={dotOf(enabled, online)} />
        <Text variant="secondary">{labelOf(enabled, online)}</Text>
        <If condition={pending > 0}>
          <Text variant="danger">{`${QUEUE_LABEL}: ${String(pending)}`}</Text>
        </If>
      </div>
    </Tooltip>
  )
}
