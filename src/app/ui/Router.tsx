import { Suspense, useEffect, useState } from 'react'
import { AuthGate } from '@/widgets/AuthGate'
import { Layout } from '@/widgets/Layout'
import { Spinner } from '@/shared/ui'
import { useChatRequest } from '@/shared/lib'
import { AppRoutes } from '@/shared/config'
import { INITIAL_ROUTE, LoginPage, PAGES } from '../model'

export const Router = () => {
  const [route, setRoute] = useState(INITIAL_ROUTE)
  const chatCompanionId = useChatRequest()
  const Page = PAGES[route]

  useEffect(() => {
    if (chatCompanionId !== null) setRoute(AppRoutes.CHAT)
  }, [chatCompanionId])

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
