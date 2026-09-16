import { useEffect, useState, type ReactNode } from 'react'
import type { IAuthUser } from '@/entities/user'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery } from '@/shared/hooks'
import { session, useSession } from '@/shared/lib'
import { If, Spinner } from '@/shared/ui'

interface IProps {
  children: ReactNode
  fallback: ReactNode
}

export const AuthGate = ({ children, fallback }: IProps) => {
  const [restored, setRestored] = useState(session.isRestored())
  const current = useSession()
  const me = useGetQuery<IAuthUser>(QueryKeys.ME, ApiRoutes.AUTH_ME, restored && current !== null)

  useEffect(() => {
    void session.restore().then(() => setRestored(true))
  }, [])

  useEffect(() => {
    if (me.data && current && me.data.id !== current.user.id) session.set({ ...current, user: me.data })
  }, [me.data, current])

  const checking = !restored || (current !== null && me.isPending)

  return (
    <If condition={!checking} fallback={<Spinner />}>
      <If condition={current !== null} fallback={fallback}>
        {children}
      </If>
    </If>
  )
}
