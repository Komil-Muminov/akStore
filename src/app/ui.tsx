import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { TooltipProvider } from '@/shared/ui'
import { ErrorFallback } from './ui/ErrorFallback'
import { Router } from './ui/Router'

const RETRY_COUNT = 5
const RETRY_BASE_MS = 500
const RETRY_MAX_MS = 3000

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: RETRY_COUNT,
      retryDelay: (attempt) => Math.min(RETRY_BASE_MS * 2 ** attempt, RETRY_MAX_MS),
      refetchOnWindowFocus: false,
    },
  },
})

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
)
