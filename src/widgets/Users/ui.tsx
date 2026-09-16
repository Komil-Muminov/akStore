import { useCallback, useMemo, useState } from 'react'
import { PasswordDialog, type IPasswordSubmit } from '@/features/PasswordDialog'
import { UserForm } from '@/features/UserForm'
import { UserList } from '@/features/UserList'
import { UserRole, assignableRoles, toRole, type IUser, type IUserInput } from '@/entities/user'
import { useSession } from '@/shared/lib'
import { Button, ConfirmDialog, If, Spinner, Text } from '@/shared/ui'
import { useUserMutations, useUsersQuery } from './hooks'
import { ADD_LABEL, COUNT_SUFFIX, DELETE_DIALOG, DESCRIPTION_ADMIN, DESCRIPTION_SUPERADMIN, TITLE } from './model'
import { header, headerText, layout, sectionHead } from './style'
import { ErrorState } from './ui/ErrorState'

export const Users = () => {
  const current = useSession()
  const [formOpen, setFormOpen] = useState(false)
  const [resetting, setResetting] = useState<IUser | null>(null)
  const [deleting, setDeleting] = useState<IUser | null>(null)
  const usersQuery = useUsersQuery()
  const { create, update, resetPassword, remove, pending } = useUserMutations()

  const actorRole = toRole(current?.user.role ?? '')
  const roles = useMemo(() => assignableRoles(actorRole), [actorRole])
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data])
  const description = actorRole === UserRole.SUPERADMIN ? DESCRIPTION_SUPERADMIN : DESCRIPTION_ADMIN
  const refetch = usersQuery.refetch

  const handleRetry = useCallback(() => void refetch(), [refetch])
  const openForm = useCallback(() => setFormOpen(true), [])
  const closeForm = useCallback(() => setFormOpen(false), [])
  const closeReset = useCallback(() => setResetting(null), [])
  const cancelDelete = useCallback(() => setDeleting(null), [])
  const createMutate = create.mutate
  const updateMutate = update.mutate
  const resetMutate = resetPassword.mutate
  const removeMutate = remove.mutate
  const handleCreate = useCallback(
    (input: IUserInput) => createMutate(input, { onSuccess: () => setFormOpen(false) }),
    [createMutate],
  )
  const handleToggle = useCallback(
    (user: IUser) => updateMutate({ id: user.id, fullName: user.fullName, isActive: !user.isActive }),
    [updateMutate],
  )
  const handleReset = useCallback(
    (values: IPasswordSubmit) => resetting && resetMutate({ id: resetting.id, password: values.next }, { onSuccess: () => setResetting(null) }),
    [resetting, resetMutate],
  )
  const handleDelete = useCallback(() => {
    if (deleting) removeMutate(deleting.id, { onSuccess: () => setDeleting(null) })
  }, [deleting, removeMutate])

  return (
    <div style={layout} testId="users__layout">
      <div style={header}>
        <div style={headerText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{description}</Text>
        </div>
        <Button label={ADD_LABEL} icon="plus" onClick={openForm} disabled={roles.length === 0} testId="users__add" />
      </div>
      <div style={sectionHead}>
        <Text variant="label">{`${TITLE.toUpperCase()} · ${users.length}${COUNT_SUFFIX}`}</Text>
      </div>
      <If condition={usersQuery.isPending} fallback={
        <If condition={usersQuery.isError} fallback={
          <UserList users={users} onResetPassword={setResetting} onToggleActive={handleToggle} onDelete={setDeleting} />
        }>
          <ErrorState details={usersQuery.error?.message ?? ''} onRetry={handleRetry} />
        </If>
      }>
        <Spinner />
      </If>
      <UserForm open={formOpen} roles={roles} pending={create.isPending} error={create.error?.message} onSubmit={handleCreate} onClose={closeForm} />
      <PasswordDialog mode={resetting ? 'reset' : null} subject={resetting?.fullName} pending={resetPassword.isPending} error={resetPassword.error?.message} onSubmit={handleReset} onClose={closeReset} />
      <ConfirmDialog open={deleting !== null} title={DELETE_DIALOG.title} text={DELETE_DIALOG.text} confirmLabel={DELETE_DIALOG.confirm} cancelLabel={DELETE_DIALOG.cancel} pending={pending} onConfirm={handleDelete} onCancel={cancelDelete} />
    </div>
  )
}
