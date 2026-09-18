import { useCallback, useMemo, useState } from 'react'
import type { IDebtor, IDebtorInput } from '@/entities/debt'
import { moneyOf } from '@/entities/product'
import { DebtorCard } from '@/features/DebtorCard'
import { DebtorForm } from '@/features/DebtorForm'
import { DebtorList } from '@/features/DebtorList'
import { Button, ConfirmDialog, Spinner, Text, TextInput } from '@/shared/ui'
import { If } from '@/shared/ui'
import { useDebtorCardQuery, useDebtorMutations, useDebtorsQuery } from './hooks'
import { ADD_LABEL, ARCHIVE_DIALOG, DESCRIPTION, SEARCH_PLACEHOLDER, TITLE, TOTAL_LABEL } from './model'
import { head, headText, root, search, totalBox, totalValue } from './style'

export const Debts = () => {
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<IDebtor | null>(null)
  const [openedId, setOpenedId] = useState<string | null>(null)
  const [archiving, setArchiving] = useState<IDebtor | null>(null)
  const debtors = useDebtorsQuery(query)
  const card = useDebtorCardQuery(openedId)
  const { create, update, archive, lend, repay } = useDebtorMutations()

  const items = useMemo(() => debtors.data ?? [], [debtors.data])
  const total = useMemo(() => items.reduce((sum, item) => sum + Math.max(item.balance, 0), 0), [items])

  const openCreate = useCallback(() => {
    setEditing(null)
    setFormOpen(true)
  }, [])
  const openEdit = useCallback((debtor: IDebtor) => {
    setEditing(debtor)
    setFormOpen(true)
  }, [])
  const closeForm = useCallback(() => setFormOpen(false), [])
  const closeCard = useCallback(() => setOpenedId(null), [])
  const cancelArchive = useCallback(() => setArchiving(null), [])
  const openCard = useCallback((debtor: IDebtor) => setOpenedId(debtor.id), [])

  const createMutate = create.mutate
  const updateMutate = update.mutate
  const handleSubmit = useCallback(
    (input: IDebtorInput) => {
      const onSuccess = () => setFormOpen(false)
      if (editing) updateMutate({ id: editing.id, input }, { onSuccess })
      else createMutate(input, { onSuccess })
    },
    [editing, createMutate, updateMutate],
  )

  const archiveMutate = archive.mutate
  const handleArchive = useCallback(() => {
    if (archiving) archiveMutate(archiving.id, { onSuccess: () => setArchiving(null) })
  }, [archiving, archiveMutate])

  const lendMutate = lend.mutate
  const handleLend = useCallback(
    (amount: number, note: string) => {
      if (openedId) lendMutate({ id: openedId, amount, note })
    },
    [lendMutate, openedId],
  )

  const repayMutate = repay.mutate
  const handleRepay = useCallback(
    (amount: number, note: string) => {
      if (openedId) repayMutate({ id: openedId, amount, note })
    },
    [repayMutate, openedId],
  )

  return (
    <div style={root} testId="debts__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
        <div style={totalBox}>
          <Text variant="caption">{TOTAL_LABEL}</Text>
          <text style={totalValue}>{moneyOf(total)}</text>
        </div>
        <TextInput value={query} onChange={setQuery} placeholder={SEARCH_PLACEHOLDER} icon="search" style={search} testId="debts__search" />
        <Button label={ADD_LABEL} icon="plus" onClick={openCreate} testId="debts__add" />
      </div>
      <If condition={debtors.isPending} fallback={
        <DebtorList debtors={items} onOpen={openCard} onEdit={openEdit} onArchive={setArchiving} />
      }>
        <Spinner />
      </If>
      <DebtorForm
        open={formOpen}
        initial={editing}
        pending={create.isPending || update.isPending}
        error={create.error?.message ?? update.error?.message}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
      <DebtorCard
        open={openedId !== null}
        card={card.data ?? null}
        pending={lend.isPending || repay.isPending}
        error={lend.error?.message ?? repay.error?.message}
        onLend={handleLend}
        onRepay={handleRepay}
        onClose={closeCard}
      />
      <ConfirmDialog
        open={archiving !== null}
        title={ARCHIVE_DIALOG.title}
        text={ARCHIVE_DIALOG.text}
        confirmLabel={ARCHIVE_DIALOG.confirm}
        cancelLabel={ARCHIVE_DIALOG.cancel}
        pending={archive.isPending}
        onConfirm={handleArchive}
        onCancel={cancelArchive}
      />
    </div>
  )
}
