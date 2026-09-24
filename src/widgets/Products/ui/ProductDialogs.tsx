import type { ICategory, IProduct, IProductInput } from '@/entities/product'
import { ImportDialog } from '@/features/ImportDialog'
import { ProductForm } from '@/features/ProductForm'
import { StockDialog, type IStockSubmit } from '@/features/StockDialog'
import { ConfirmDialog } from '@/shared/ui'
import type { useImport } from '../import'
import { ARCHIVE_DIALOG } from '../model'

interface IProps {
  formOpen: boolean
  editing: IProduct | null
  categories: ICategory[]
  formPending: boolean
  formError?: string
  createdCategoryId: string | null
  onSubmitProduct: (input: IProductInput) => void
  onCloseForm: () => void
  onCreateCategory: (name: string) => void
  onRenameCategory: (id: string, name: string) => void
  onRemoveCategory: (id: string) => void
  importOpen: boolean
  importer: ReturnType<typeof useImport>
  onCloseImport: () => void
  moving: IProduct | null
  movePending: boolean
  moveError?: string
  onSubmitMove: (submit: IStockSubmit) => void
  onCloseMove: () => void
  archiving: IProduct | null
  archivePending: boolean
  onConfirmArchive: () => void
  onCancelArchive: () => void
}

export const ProductDialogs = ({
  formOpen,
  editing,
  categories,
  formPending,
  formError,
  createdCategoryId,
  onSubmitProduct,
  onCloseForm,
  onCreateCategory,
  onRenameCategory,
  onRemoveCategory,
  importOpen,
  importer,
  onCloseImport,
  moving,
  movePending,
  moveError,
  onSubmitMove,
  onCloseMove,
  archiving,
  archivePending,
  onConfirmArchive,
  onCancelArchive,
}: IProps) => (
  <>
    <ProductForm
      open={formOpen}
      initial={editing}
      categories={categories}
      pending={formPending}
      error={formError}
      onSubmit={onSubmitProduct}
      onClose={onCloseForm}
      onCreateCategory={onCreateCategory}
      onRenameCategory={onRenameCategory}
      onRemoveCategory={onRemoveCategory}
      createdCategoryId={createdCategoryId}
    />
    <ImportDialog
      open={importOpen}
      preview={importer.preview}
      result={importer.result}
      pending={importer.pending}
      error={importer.error}
      onDrop={importer.handleDrop}
      onApply={importer.handleApply}
      onTemplate={importer.handleTemplate}
      onClose={onCloseImport}
    />
    <StockDialog
      product={moving}
      pending={movePending}
      error={moveError}
      onSubmit={onSubmitMove}
      onClose={onCloseMove}
    />
    <ConfirmDialog
      open={archiving !== null}
      title={ARCHIVE_DIALOG.title}
      text={ARCHIVE_DIALOG.text}
      confirmLabel={ARCHIVE_DIALOG.confirm}
      cancelLabel={ARCHIVE_DIALOG.cancel}
      pending={archivePending}
      onConfirm={onConfirmArchive}
      onCancel={onCancelArchive}
    />
  </>
)
