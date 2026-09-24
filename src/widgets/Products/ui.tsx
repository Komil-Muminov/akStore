import { useCallback, useMemo, useState } from 'react'
import type { IProduct, IProductInput } from '@/entities/product'
import { ProductList } from '@/features/ProductList'
import type { IStockSubmit } from '@/features/StockDialog'
import { ApiRoutes } from '@/shared/config'
import { openPrintable, useOutletScope } from '@/shared/lib'
import { Button, If, Spinner, Text, TextInput, Tooltip } from '@/shared/ui'
import { useCategoriesQuery, useCategoryMutations, useProductMutations, useProductsQuery } from './hooks'
import { useImport } from './import'
import {
  ADD_LABEL,
  DESCRIPTION,
  IMPORT_LABEL,
  IMPORT_TOOLTIP,
  LABEL_FILE,
  LOW_STOCK_FILTER,
  LOW_STOCK_TOOLTIP,
  PRINT_LABELS_LABEL,
  PRINT_LABELS_TOOLTIP,
  SEARCH_PLACEHOLDER,
  TITLE,
} from './model'
import { actions, filterBtnOf, head, headText, root, search } from './style'
import { ProductDialogs } from './ui/ProductDialogs'

export const Products = () => {
  const [query, setQuery] = useState('')
  const [lowStock, setLowStock] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<IProduct | null>(null)
  const [moving, setMoving] = useState<IProduct | null>(null)
  const [archiving, setArchiving] = useState<IProduct | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const importer = useImport()
  const outletId = useOutletScope()
  const products = useProductsQuery(query, null, outletId, lowStock)
  const categories = useCategoriesQuery()
  const category = useCategoryMutations()
  const [createdCategoryId, setCreatedCategoryId] = useState<string | null>(null)
  const { create, update, archive, move } = useProductMutations()

  const items = useMemo(() => products.data?.items ?? [], [products.data?.items])

  const openCreate = useCallback(() => {
    setEditing(null)
    setFormOpen(true)
  }, [])
  const openEdit = useCallback((product: IProduct) => {
    setEditing(product)
    setFormOpen(true)
  }, [])
  const closeForm = useCallback(() => {
    setFormOpen(false)
    setCreatedCategoryId(null)
  }, [])
  const closeStock = useCallback(() => setMoving(null), [])
  const cancelArchive = useCallback(() => setArchiving(null), [])

  const handleLabel = useCallback((product: IProduct) => {
    void openPrintable(ApiRoutes.PRODUCTS_LABELS([product.id]), LABEL_FILE)
  }, [])

  const handlePrintAllLabels = useCallback(() => {
    if (items.length === 0) return
    void openPrintable(ApiRoutes.PRODUCTS_LABELS(items.map((p) => p.id)), LABEL_FILE)
  }, [items])

  const resetImport = importer.reset
  const openImport = useCallback(() => {
    resetImport()
    setImportOpen(true)
  }, [resetImport])
  const closeImport = useCallback(() => {
    setImportOpen(false)
    resetImport()
  }, [resetImport])

  const createMutate = create.mutate
  const updateMutate = update.mutate
  const handleSubmit = useCallback(
    (input: IProductInput) => {
      const onSuccess = () => setFormOpen(false)
      if (editing) updateMutate({ id: editing.id, input }, { onSuccess })
      else createMutate(input, { onSuccess })
    },
    [editing, createMutate, updateMutate],
  )

  const archiveMutate = archive.mutate
  const handleArchive = useCallback(() => {
    if (!archiving) return
    archiveMutate(archiving.id, { onSuccess: cancelArchive })
  }, [archiving, archiveMutate, cancelArchive])

  const moveMutate = move.mutate
  const handleMove = useCallback(
    (submit: IStockSubmit) => {
      if (!moving) return
      moveMutate({ product: moving, action: submit.action, quantity: submit.quantity, costPrice: submit.costPrice, note: submit.note }, { onSuccess: closeStock })
    },
    [moving, moveMutate, closeStock],
  )

  const categoryCreate = category.create.mutate
  const handleCreateCategory = useCallback(
    (name: string) => categoryCreate(name, { onSuccess: (created) => setCreatedCategoryId(created.id) }),
    [categoryCreate],
  )
  const categoryRename = category.rename.mutate
  const handleRenameCategory = useCallback(
    (id: string, name: string) => categoryRename({ id, name }),
    [categoryRename],
  )
  const categoryRemove = category.remove.mutate
  const handleRemoveCategory = useCallback(
    (id: string) => categoryRemove(id),
    [categoryRemove],
  )

  return (
    <div style={root} testId="products__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
        <TextInput value={query} onChange={setQuery} placeholder={SEARCH_PLACEHOLDER} icon="search" style={search} testId="products__search" />
        <div style={actions}>
          <Tooltip title={LOW_STOCK_TOOLTIP}>
            <div style={filterBtnOf(lowStock)} onClick={() => setLowStock((v) => !v)} testId="products__low-filter">
              <Text variant="caption">{LOW_STOCK_FILTER}</Text>
            </div>
          </Tooltip>
          <If condition={items.length > 0}>
            <Tooltip title={PRINT_LABELS_TOOLTIP}>
              <Button label={PRINT_LABELS_LABEL} icon="barcode" variant="secondary" onClick={handlePrintAllLabels} testId="products__print-labels" />
            </Tooltip>
          </If>
          <Tooltip title={IMPORT_TOOLTIP}>
            <Button label={IMPORT_LABEL} icon="download" variant="secondary" onClick={openImport} testId="products__import" />
          </Tooltip>
          <Button label={ADD_LABEL} icon="plus" onClick={openCreate} testId="products__add" />
        </div>
      </div>
      <If condition={products.isPending} fallback={
        <ProductList products={items} onEdit={openEdit} onStock={setMoving} onArchive={setArchiving} onLabel={handleLabel} />
      }>
        <Spinner />
      </If>
      <ProductDialogs
        formOpen={formOpen}
        editing={editing}
        categories={categories.data ?? []}
        formPending={create.isPending || update.isPending}
        formError={create.error?.message ?? update.error?.message ?? category.remove.error?.message ?? category.rename.error?.message}
        createdCategoryId={createdCategoryId}
        onSubmitProduct={handleSubmit}
        onCloseForm={closeForm}
        onCreateCategory={handleCreateCategory}
        onRenameCategory={handleRenameCategory}
        onRemoveCategory={handleRemoveCategory}
        importOpen={importOpen}
        importer={importer}
        onCloseImport={closeImport}
        moving={moving}
        movePending={move.isPending}
        moveError={move.error?.message}
        onSubmitMove={handleMove}
        onCloseMove={closeStock}
        archiving={archiving}
        archivePending={archive.isPending}
        onConfirmArchive={handleArchive}
        onCancelArchive={cancelArchive}
      />
    </div>
  )
}
