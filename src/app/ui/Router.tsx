import { Suspense, useState } from 'react'
import { Spinner } from '@/shared/ui'
import { INITIAL_ROUTE, PAGES } from '../model'

export const Router = () => {
  const [route] = useState(INITIAL_ROUTE)
  const Page = PAGES[route]

  return (
    <Suspense fallback={<Spinner />}>
      <Page />
    </Suspense>
  )
}
