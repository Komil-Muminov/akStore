import { useCallback, useMemo, useState } from 'react'
import { moneyOf } from '@/entities/product'
import type { IInvoice, ISupplier, ISupplierInput } from '@/entities/supplier'
import { InvoiceForm } from '@/features/InvoiceForm'
import { SupplierForm } from '@/features/SupplierForm'
import { theme } from '@/shared/config'
import { Button, ConfirmDialog, Icon, If, Spinner, Text, TextInput } from '@/shared/ui'
import { useCatalogQuery, useInvoicesQuery, useSupplierMutations, useSuppliersQuery } from './hooks'
import { useInvoiceDraft } from './invoice'
import {
  ADD_LABEL,
  ARCHIVE_DIALOG,
  DESCRIPTION,
  EMPTY_HINT,
  EMPTY_INVOICES,
  EMPTY_TITLE,
  INVOICES_TITLE,
  RECEIVE_LABEL,
  SEARCH_PLACEHOLDER,
  TITLE,
  TOTAL_DEBT_LABEL,
} from './model'
import { column, columns, empty, head, headText, root, search, totalBox, totalValue } from './style'
import { InvoiceRows } from './ui/InvoiceRows'
import { SupplierRows } from './ui/SupplierRows'

export const Suppliers = () => {
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ISupplier | null>(null)
  const [archiving, setArchiving] = useState<ISupplier | null>(null)
  const suppliers = useSuppliersQuery(query)
  const invoices = useInvoicesQuery(null)
  const catalog = useCatalogQuery()
  const draft = useInvoiceDraft()
  const { create, update, archive, receive, pay } = useSupplierMutations()

  const items = useMemo(() => suppliers.data ?? [], [suppliers.data])
  const totalDebt = useMemo(() => items.reduce((sum, item) => sum + Math.max(item.debt, 0), 0), [items])
  const products = useMemo(() => catalog.data?.items ?? [], [catalog.data?.items])

  const openCreate = useCallback(() => {
    setEditing(null)
    setFormOpen(true)
  }, [])
  const openEdit = useCallback((supplier: ISupplier) => {
    setEditing(supplier)
    setFormOpen(true)
  }, [])
  const closeForm = useCallback(() => setFormOpen(false), [])
  const cancelArchive = useCallback(() => setArchiving(null), [])

  const createMutate = create.mutate
  const updateMutate = update.mutate
  const handleSubmit = useCallback(
    (input: ISupplierInput) => {
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

  const receiveMutate = receive.mutate
  const closeDraft = draft.closeDialog
  const handleReceive = useCallback(() => {
    if (!draft.supplierId) return
    receiveMutate(
      {
        supplierId: draft.supplierId,
        paid: Number(draft.paid.replace(',', '.')) || 0,
        note: draft.note,
        items: draft.lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          costPrice: line.costPrice,
        })),
      },
      { onSuccess: closeDraft },
    )
  }, [draft.supplierId, draft.paid, draft.note, draft.lines, receiveMutate, closeDraft])

  const addProduct = draft.addProduct
  const handleAddProduct = useCallback(
    (id: string | null) => addProduct(products.find((product) => product.id === id)),
    [addProduct, products],
  )

  const payMutate = pay.mutate
  const handlePay = useCallback(
    (invoice: IInvoice) => payMutate({ id: invoice.id, amount: invoice.total - invoice.paid }),
    [payMutate],
  )

  return (
    <div style={root} testId="suppliers__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
        <div style={totalBox}>
          <Text variant="caption">{TOTAL_DEBT_LABEL}</Text>
          <text style={totalValue}>{moneyOf(totalDebt)}</text>
        </div>
        <TextInput value={query} onChange={setQuery} placeholder={SEARCH_PLACEHOLDER} icon="search" style={search} testId="suppliers__search" />
        <Button label={RECEIVE_LABEL} icon="inbox" variant="secondary" onClick={draft.openDialog} testId="suppliers__receive" />
        <Button label={ADD_LABEL} icon="plus" onClick={openCreate} testId="suppliers__add" />
      </div>
      <If condition={suppliers.isPending} fallback={
        <div style={columns}>
          <div style={column}>
            <If
              condition={items.length > 0}
              fallback={
                <div style={empty}>
                  <Icon name="briefcase" size={theme.size.iconXl} color={theme.colors.ghost} />
                  <Text variant="title">{EMPTY_TITLE}</Text>
                  <Text variant="secondary">{EMPTY_HINT}</Text>
                </div>
              }
            >
              <SupplierRows suppliers={items} onEdit={openEdit} onArchive={setArchiving} />
            </If>
          </div>
          <div style={column}>
            <Text variant="title">{INVOICES_TITLE}</Text>
            <If
              condition={(invoices.data ?? []).length > 0}
              fallback={<Text variant="secondary">{EMPTY_INVOICES}</Text>}
            >
              <InvoiceRows invoices={invoices.data ?? []} onPay={handlePay} />
            </If>
          </div>
        </div>
      }>
        <Spinner />
      </If>
      <SupplierForm
        open={formOpen}
        initial={editing}
        pending={create.isPending || update.isPending}
        error={create.error?.message ?? update.error?.message}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
      <InvoiceForm
        open={draft.open}
        suppliers={items}
        products={products}
        lines={draft.lines}
        supplierId={draft.supplierId}
        paid={draft.paid}
        note={draft.note}
        pending={receive.isPending}
        error={receive.error?.message}
        onSupplierChange={draft.setSupplierId}
        onAddProduct={handleAddProduct}
        onLineChange={draft.changeLine}
        onLineRemove={draft.removeLine}
        onPaidChange={draft.setPaid}
        onNoteChange={draft.setNote}
        onSubmit={handleReceive}
        onClose={draft.closeDialog}
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
