import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import type { IImportPreview, IImportResult } from '@/features/ImportDialog'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { downloadFile, request, uploadFile } from '@/shared/lib'

const INVALIDATE = [QueryKeys.PRODUCTS, QueryKeys.CATEGORIES, QueryKeys.STOCK_HISTORY]
const TEMPLATE_FILE = 'shablon-tovarov.csv'
const NO_FILE = 'Файл не выбран'

export const useImport = () => {
  const queryClient = useQueryClient()
  const [preview, setPreview] = useState<IImportPreview | null>(null)
  const [result, setResult] = useState<IImportResult | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)

  const upload = useMutation<IImportPreview, Error, string>({
    mutationFn: (filePath) => uploadFile<IImportPreview>(ApiRoutes.IMPORT_PREVIEW, filePath, ''),
    onSuccess: (data) => setPreview(data),
    onError: (failure) => setError(failure.message),
  })

  const apply = useMutation<IImportResult, Error, string>({
    mutationFn: (fileName) =>
      request<IImportResult>(ApiRoutes.IMPORT_APPLY, { method: 'POST', body: { fileName } }),
    onSuccess: async (data) => {
      setResult(data)
      setPreview(null)
      for (const key of INVALIDATE) {
        await queryClient.invalidateQueries({ queryKey: [key] })
      }
    },
    onError: (failure) => setError(failure.message),
  })

  const uploadMutate = upload.mutate
  const handleDrop = useCallback(
    (paths: string[]) => {
      const filePath = paths[0]
      setError(undefined)
      setResult(null)
      if (!filePath) {
        setError(NO_FILE)
        return
      }
      uploadMutate(filePath)
    },
    [uploadMutate],
  )

  const applyMutate = apply.mutate
  const handleApply = useCallback(() => {
    if (!preview) return
    setError(undefined)
    applyMutate(preview.fileName)
  }, [applyMutate, preview])

  const handleTemplate = useCallback(async () => {
    setError(undefined)
    try {
      await downloadFile(ApiRoutes.IMPORT_TEMPLATE, TEMPLATE_FILE)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : undefined)
    }
  }, [])

  const reset = useCallback(() => {
    setPreview(null)
    setResult(null)
    setError(undefined)
  }, [])

  return {
    preview,
    result,
    error,
    pending: upload.isPending || apply.isPending,
    handleDrop,
    handleApply,
    handleTemplate: useCallback(() => void handleTemplate(), [handleTemplate]),
    reset,
  }
}
