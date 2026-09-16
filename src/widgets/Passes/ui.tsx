import { useCallback, useMemo, useState } from 'react'
import { PassDetails } from '@/features/PassDetails'
import { PassForm } from '@/features/PassForm'
import { PassList } from '@/features/PassList'
import { Sidebar } from '@/features/Sidebar'
import type { IPass, IPassInput, PassFilter } from '@/entities/pass'
import { ConfirmDialog, If, Spinner, Text } from '@/shared/ui'
import { usePassMutations, usePassesQuery } from './hooks'
import { countByFilter, selectVisible } from './lib'
import { CLOSED_FORM, COUNT_SUFFIX, DELETE_DIALOG, HEADERS, INITIAL_FILTER, type IFormState } from './model'
import { layout, main, sectionHead } from './style'
import { ErrorState } from './ui/ErrorState'
import { Header } from './ui/Header'

export const Passes = () => {
  const [filter, setFilter] = useState<PassFilter>(INITIAL_FILTER)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<IFormState>(CLOSED_FORM)
  const [deleting, setDeleting] = useState<IPass | null>(null)
  const passes = usePassesQuery()
  const { create, update, revoke, restore, remove, pending } = usePassMutations()

  const items = passes.data ?? []
  const counts = useMemo(() => countByFilter(items), [items])
  const visible = useMemo(() => selectVisible(items, filter, query), [items, filter, query])
  const selected = useMemo(() => items.find((pass) => pass.id === selectedId) ?? null, [items, selectedId])
  const heading = HEADERS[filter]
  const formError = form.mode === 'edit' ? update.error?.message : create.error?.message
  const formPending = create.isPending || update.isPending

  const refetch = passes.refetch
  const handleRetry = useCallback(() => void refetch(), [refetch])
  const openCreate = useCallback(() => setForm({ mode: 'create' }), [])
  const openEdit = useCallback((pass: IPass) => setForm({ mode: 'edit', pass }), [])
  const closeForm = useCallback(() => setForm(CLOSED_FORM), [])
  const closeDetails = useCallback(() => setSelectedId(null), [])
  const cancelDelete = useCallback(() => setDeleting(null), [])

  const handleSubmit = useCallback(
    (input: IPassInput) => {
      const onSuccess = () => setForm(CLOSED_FORM)
      form.mode === 'edit' && form.pass
        ? update.mutate({ id: form.pass.id, input }, { onSuccess })
        : create.mutate(input, { onSuccess })
    },
    [form, create, update],
  )
  const handleRevoke = useCallback((id: string) => revoke.mutate(id), [revoke])
  const handleRestore = useCallback((id: string) => restore.mutate(id), [restore])
  const handleDelete = useCallback(() => {
    if (!deleting) return
    remove.mutate(deleting.id, {
      onSuccess: () => {
        setDeleting(null)
        setSelectedId((current) => (current === deleting.id ? null : current))
      },
    })
  }, [deleting, remove])

  return (
    <div style={layout} testId="passes__layout">
      <Sidebar active={filter} counts={counts} onSelect={setFilter} />
      <div style={main}>
        <Header
          title={heading.title}
          description={heading.description}
          query={query}
          onQueryChange={setQuery}
          onCreate={openCreate}
        />
        <div style={sectionHead}>
          <Text variant="label">{`${heading.title.toUpperCase()} · ${visible.length}${COUNT_SUFFIX}`}</Text>
        </div>
        <If condition={passes.isPending} fallback={
          <If
            condition={passes.isError}
            fallback={
              <PassList
                passes={visible}
                filter={filter}
                searching={query.trim().length > 0}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onRevoke={handleRevoke}
                onRestore={handleRestore}
                onDelete={setDeleting}
              />
            }
          >
            <ErrorState details={passes.error?.message ?? ''} onRetry={handleRetry} />
          </If>
        }>
          <Spinner />
        </If>
      </div>
      <If condition={selected !== null}>
        {() => (
          <PassDetails
            pass={selected as IPass}
            pending={pending}
            onEdit={openEdit}
            onRevoke={handleRevoke}
            onRestore={handleRestore}
            onDelete={setDeleting}
            onClose={closeDetails}
          />
        )}
      </If>
      <PassForm
        mode={form.mode}
        initial={form.pass}
        pending={formPending}
        error={formError}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
      <ConfirmDialog
        open={deleting !== null}
        title={DELETE_DIALOG.title}
        text={DELETE_DIALOG.text}
        confirmLabel={DELETE_DIALOG.confirm}
        cancelLabel={DELETE_DIALOG.cancel}
        pending={remove.isPending}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}
