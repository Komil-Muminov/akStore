import { useCallback, useState } from 'react'
import type { IOutlet, IOutletInput } from '@/entities/outlet'
import { moneyOf } from '@/entities/product'
import { OutletForm } from '@/features/OutletForm'
import { TransferDialog } from '@/features/TransferDialog'
import { theme } from '@/shared/config'
import { Button, ConfirmDialog, Icon, IconButton, If, Spinner, Text, Tooltip } from '@/shared/ui'
import { useOutletMutations, useOutletStocksQuery, useOutletsQuery, useTransferProductsQuery } from './hooks'
import {
  ADD_LABEL,
  ARCHIVE_DIALOG,
  ARCHIVE_TOOLTIP,
  DESCRIPTION,
  EDIT_TOOLTIP,
  EMPTY_HINT,
  EMPTY_TITLE,
  POSITIONS_LABEL,
  TITLE,
  TRANSFER_LABEL,
  VALUE_LABEL,
} from './model'
import { card, cardHead, cardTitle, cardValue, cards, empty, head, headText, root } from './style'

export const Outlets = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [editing, setEditing] = useState<IOutlet | null>(null)
  const [archiving, setArchiving] = useState<IOutlet | null>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const outlets = useOutletsQuery()
  const products = useTransferProductsQuery('')
  const stocks = useOutletStocksQuery(productId)
  const { create, update, archive, transfer } = useOutletMutations()

  const openCreate = useCallback(() => {
    setEditing(null)
    setFormOpen(true)
  }, [])
  const openEdit = useCallback((outlet: IOutlet) => {
    setEditing(outlet)
    setFormOpen(true)
  }, [])
  const closeForm = useCallback(() => setFormOpen(false), [])
  const openTransfer = useCallback(() => setTransferOpen(true), [])
  const closeTransfer = useCallback(() => setTransferOpen(false), [])
  const cancelArchive = useCallback(() => setArchiving(null), [])

  const createMutate = create.mutate
  const updateMutate = update.mutate
  const handleSubmit = useCallback(
    (input: IOutletInput) => {
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

  const transferMutate = transfer.mutate
  const handleTransfer = useCallback(
    (fromOutletId: string, toOutletId: string, quantity: number, note: string) => {
      if (productId) transferMutate({ productId, fromOutletId, toOutletId, quantity, note })
    },
    [productId, transferMutate],
  )

  return (
    <div style={root} testId="outlets__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
        <Button label={TRANSFER_LABEL} icon="car" variant="secondary" onClick={openTransfer} testId="outlets__transfer" />
        <Button label={ADD_LABEL} icon="plus" onClick={openCreate} testId="outlets__add" />
      </div>
      <If condition={outlets.isPending} fallback={
        <If
          condition={(outlets.data ?? []).length > 0}
          fallback={
            <div style={empty}>
              <Icon name="building" size={theme.size.iconXl} color={theme.colors.ghost} />
              <Text variant="title">{EMPTY_TITLE}</Text>
              <Text variant="secondary">{EMPTY_HINT}</Text>
            </div>
          }
        >
          <div style={cards}>
            {(outlets.data ?? []).map((outlet) => (
              <div key={outlet.id} style={card}>
                <div style={cardHead}>
                  <div style={cardTitle}>
                    <Text variant="title">{outlet.name}</Text>
                    <Text variant="caption">{`${outlet.address || '—'} · ${outlet.phone || '—'}`}</Text>
                  </div>
                  <Tooltip title={EDIT_TOOLTIP}>
                    <IconButton icon="pencil" onClick={() => openEdit(outlet)} testId={`outlets__edit-${outlet.id}`} />
                  </Tooltip>
                  <Tooltip title={ARCHIVE_TOOLTIP}>
                    <IconButton
                      icon="trash"
                      onClick={() => setArchiving(outlet)}
                      hoverColor={theme.colors.dangerSoft}
                      testId={`outlets__archive-${outlet.id}`}
                    />
                  </Tooltip>
                </div>
                <Text variant="caption">{`${String(outlet.productCount)} ${POSITIONS_LABEL} · ${VALUE_LABEL}`}</Text>
                <text style={cardValue}>{moneyOf(outlet.stockValue)}</text>
              </div>
            ))}
          </div>
        </If>
      }>
        <Spinner />
      </If>
      <OutletForm
        open={formOpen}
        initial={editing}
        pending={create.isPending || update.isPending}
        error={create.error?.message ?? update.error?.message}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
      <TransferDialog
        open={transferOpen}
        outlets={outlets.data ?? []}
        products={products.data?.items ?? []}
        stocks={stocks.data ?? []}
        productId={productId}
        pending={transfer.isPending}
        error={transfer.error?.message}
        onProductChange={setProductId}
        onSubmit={handleTransfer}
        onClose={closeTransfer}
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
