import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { NAV_ITEMS, NavSidebar } from '@/features/NavSidebar'
import { PasswordDialog, type IPasswordSubmit, type TPasswordMode } from '@/features/PasswordDialog'
import { atLeast, toRole, type IAuthUser } from '@/entities/user'
import { ApiRoutes, type AppRoutes } from '@/shared/config'
import { useMutationQuery } from '@/shared/hooks'
import { session, useSession } from '@/shared/lib'
import { useUnreadTotal } from './hooks'
import { content, root } from './style'

interface IProps {
  active: AppRoutes
  onNavigate: (route: AppRoutes) => void
  children: ReactNode
}

export const Layout = ({ active, onNavigate, children }: IProps) => {
  const current = useSession()
  const [passwordMode, setPasswordMode] = useState<TPasswordMode | null>(null)
  const changePassword = useMutationQuery<{ ok: true }, IPasswordSubmit>(ApiRoutes.AUTH_CHANGE_PASSWORD, { invalidate: [] })
  const user = useMemo<IAuthUser>(
    () => ({ ...(current?.user ?? { id: '', login: '', fullName: '' }), role: toRole(current?.user.role ?? '') }),
    [current],
  )
  const items = useMemo(() => NAV_ITEMS.filter((item) => atLeast(user.role, item.minRole)), [user.role])
  const unread = useUnreadTotal(current !== null)

  useEffect(() => {
    const first = items[0]
    if (first && !items.some((item) => item.id === active)) onNavigate(first.id)
  }, [items, active, onNavigate])

  const openChange = useCallback(() => setPasswordMode('change'), [])
  const closeChange = useCallback(() => setPasswordMode(null), [])
  const logout = useCallback(() => session.set(null), [])
  const mutate = changePassword.mutate
  const submitPassword = useCallback(
    (values: IPasswordSubmit) => mutate(values, { onSuccess: () => setPasswordMode(null) }),
    [mutate],
  )

  return (
    <div style={root} testId="layout">
      <NavSidebar active={active} items={items} unread={unread} user={user} onNavigate={onNavigate} onChangePassword={openChange} onLogout={logout} />
      <div style={content}>{children}</div>
      <PasswordDialog
        mode={passwordMode}
        pending={changePassword.isPending}
        error={changePassword.error?.message}
        onSubmit={submitPassword}
        onClose={closeChange}
      />
    </div>
  )
}
