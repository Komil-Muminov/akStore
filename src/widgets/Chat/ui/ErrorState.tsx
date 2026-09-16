import { Button, Text } from '@/shared/ui'
import { ERROR_TITLE, RETRY_LABEL } from '../model'
import { errorState } from '../style'

interface IProps {
  details: string
  onRetry: () => void
}

export const ErrorState = ({ details, onRetry }: IProps) => (
  <div style={errorState} testId="chat__error">
    <Text variant="title">{ERROR_TITLE}</Text>
    <Text variant="secondary">{details}</Text>
    <Button label={RETRY_LABEL} icon="rotate" variant="secondary" onClick={onRetry} />
  </div>
)
