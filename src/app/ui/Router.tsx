import { Suspense, useState } from 'react'
import { AuthGate } from '@/widgets/AuthGate'
import { Layout } from '@/widgets/Layout'
import { Spinner } from '@/shared/ui'
import { INITIAL_ROUTE, LoginPage, PAGES } from '../model'

export const Router = () => {
  const [route, setRoute] = useState(INITIAL_ROUTE)
  const Page = PAGES[route]

  return (
    <Suspense fallback={<Spinner />}>
      <AuthGate fallback={<LoginPage />}>
        <Layout active={route} onNavigate={setRoute}>
          <Suspense fallback={<Spinner />}>
            <Page />
          </Suspense>
        </Layout>
      </AuthGate>
    </Suspense>
  )
}
