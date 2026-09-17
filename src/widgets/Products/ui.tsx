import { useCallback, useMemo, useState } from 'react'
import type { IProduct, IProductInput } from '@/entities/product'
import { ProductForm } from '@/features/ProductForm'
import { ProductList } from '@/features/ProductList'
import { StockDialog, type IStockSubmit } from '@/features/StockDialog'
import { Button, ConfirmDialog, Spinner, Text, TextInput } from '@/shared/ui'
import { If } from '@/shared/ui'
import { useCategoriesQuery, useCategoryMutations, useProductMutations, useProductsQuery } from './hooks'
import { ADD_LABEL, ARCHIVE_DIALOG, DESCRIPTION, SEARCH_PLACEHOLDER, TITLE } from './model'
import { head, headText, root, search } from './style'

export const Products = () => {
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<IProduct | null>(null)
  const [moving, setMoving] = useState<IProduct | null>(null)
  const [archiving, setArchiving] = useState<IProduct | null>(null)
  const products = useProductsQuery(query, null)
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

  const createCategoryMutate = category.create.mutate
  const handleCreateCategory = useCallback(
    (name: string) => {
      createCategoryMutate(
        { name },
        { onSuccess: (list) => setCreatedCategoryId(list.find((item) => item.name === name)?.id ?? null) },
      )
    },
    [createCategoryMutate],
  )

  const renameCategoryMutate = category.rename.mutate
  const handleRenameCategory = useCallback(
    (id: string, name: string) => renameCategoryMutate({ id, name }),
    [renameCategoryMutate],
  )

  const removeCategoryMutate = category.remove.mutate
  const handleRemoveCategory = useCallback((id: string) => removeCategoryMutate(id), [removeCategoryMutate])

  const moveMutate = move.mutate
  const handleMove = useCallback(
    (values: IStockSubmit) => moveMutate(values, { onSuccess: () => setMoving(null) }),
    [moveMutate],
  )

  const archiveMutate = archive.mutate
  const handleArchive = useCallback(() => {
    if (archiving) archiveMutate(archiving.id, { onSuccess: () => setArchiving(null) })
  }, [archiving, archiveMutate])

  return (
    <div style={root} testId="products__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
        <TextInput value={query} onChange={setQuery} placeholder={SEARCH_PLACEHOLDER} icon="search" style={search} testId="products__search" />
        <Button label={ADD_LABEL} icon="plus" onClick={openCreate} testId="products__add" />
      </div>
      <If condition={products.isPending} fallback={
        <ProductList products={items} onEdit={openEdit} onStock={setMoving} onArchive={setArchiving} />
      }>
        <Spinner />
      </If>
      <ProductForm
        open={formOpen}
        initial={editing}
        categories={categories.data ?? []}
        pending={create.isPending || update.isPending}
        error={create.error?.message ?? update.error?.message ?? category.remove.error?.message ?? category.rename.error?.message}
        onSubmit={handleSubmit}
        onClose={closeForm}
        onCreateCategory={handleCreateCategory}
        onRenameCategory={handleRenameCategory}
        onRemoveCategory={handleRemoveCategory}
        createdCategoryId={createdCategoryId}
      />
      <StockDialog
        product={moving}
        pending={move.isPending}
        error={move.error?.message}
        onSubmit={handleMove}
        onClose={closeStock}
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
