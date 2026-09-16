import { theme } from '@/shared/config'
import { Icon, If, Text } from '@/shared/ui'
import { COUNT_SUFFIX, EMPTY, TITLE, type IProps } from './model'
import { fill, head, root, row, rowHead, rowText, track } from './style'

export const ReportHosts = ({ hosts }: IProps) => {
  const max = hosts[0]?.count ?? 0

  return (
    <div style={root} testId="report-hosts">
      <div style={head}>
        <Icon name="users" size={theme.size.iconMd} color={theme.colors.tertiary} />
        <Text variant="label">{TITLE}</Text>
      </div>
      <If condition={hosts.length > 0} fallback={<Text variant="ghost">{EMPTY}</Text>}>
        {hosts.map((host) => (
          <div key={host.hostName} style={row}>
            <div style={rowHead}>
              <div style={rowText}>
                <Text variant="body">{host.hostName}</Text>
              </div>
              <Text variant="secondary">{`${host.count}${COUNT_SUFFIX}`}</Text>
            </div>
            <div style={track}>
              <div style={fill(max > 0 ? host.count / max : 0)} />
            </div>
          </div>
        ))}
      </If>
    </div>
  )
}
