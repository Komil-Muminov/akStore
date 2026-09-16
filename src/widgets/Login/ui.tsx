import { useCallback } from 'react'
import { LoginForm } from '@/features/LoginForm'
import type { ICredentials, ILoginResult } from '@/entities/user'
import { ApiRoutes } from '@/shared/config'
import { useMutationQuery } from '@/shared/hooks'
import { session } from '@/shared/lib'

export const Login = () => {
  const login = useMutationQuery<ILoginResult, ICredentials>(ApiRoutes.AUTH_LOGIN, { invalidate: [] })
  const loginMutate = login.mutate
  const handleSubmit = useCallback(
    (credentials: ICredentials) => loginMutate(credentials, { onSuccess: (result) => session.set(result) }),
    [loginMutate],
  )

  return <LoginForm pending={login.isPending} error={login.error?.message} onSubmit={handleSubmit} />
}
