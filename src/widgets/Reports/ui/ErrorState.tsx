import { theme } from '@/shared/config'
import { Button, Icon, Text } from '@/shared/ui'
import { ERROR_HINT, ERROR_TITLE, RETRY_LABEL } from '../model'
import { message } from '../style'

interface IProps {
  details: string
  onRetry: () => void
}

export const ErrorState = ({ details, onRetry }: IProps) => (
  <div style={message} testId="reports__error">
    <Icon name="shieldOff" size={theme.size.iconXl} color={theme.colors.danger} />
    <Text variant="title">{ERROR_TITLE}</Text>
    <Text variant="secondary">{ERROR_HINT}</Text>
    <Text variant="caption">{details}</Text>
    <Button label={RETRY_LABEL} icon="rotate" variant="secondary" onClick={onRetry} />
  </div>
)
