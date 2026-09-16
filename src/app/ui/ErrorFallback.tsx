import type { FallbackProps } from 'react-error-boundary'
import { Button, Text } from '@/shared/ui'
import { ERROR_TITLE, RETRY_LABEL } from '../model'
import { fallback } from '../style'

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div style={fallback} testId="app__error">
    <Text variant="title">{ERROR_TITLE}</Text>
    <Text variant="secondary">{error instanceof Error ? error.message : String(error)}</Text>
    <Button label={RETRY_LABEL} onClick={resetErrorBoundary} />
  </div>
)
