import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { TooltipProvider } from '@/shared/ui'
import { ErrorFallback } from './ui/ErrorFallback'
import { Router } from './ui/Router'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
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
