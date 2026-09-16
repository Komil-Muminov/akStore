import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import type { IMessage } from '@/entities/message'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { downloadFile, revealFile, uploadFile } from '@/shared/lib'

interface IUploadVariables {
  conversationId: string
  filePath: string
  caption: string
}

const INVALIDATE = [QueryKeys.CHAT, QueryKeys.CHAT_HISTORY]

export const useAttachments = (activeId: string | null) => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | undefined>(undefined)

  const upload = useMutation<IMessage, Error, IUploadVariables>({
    mutationFn: (variables) =>
      uploadFile<IMessage>(
        ApiRoutes.CHAT_UPLOAD(variables.conversationId),
        variables.filePath,
        variables.caption,
      ),
    onSuccess: async () => {
      for (const key of INVALIDATE) {
        await queryClient.invalidateQueries({ queryKey: [key] })
      }
    },
    onError: (failure) => setError(failure.message),
  })

  const uploadMutate = upload.mutate
  const sendFiles = useCallback(
    (paths: string[]) => {
      if (activeId === null) return
      setError(undefined)
      for (const filePath of paths) {
        uploadMutate({ conversationId: activeId, filePath, caption: '' })
      }
    },
    [activeId, uploadMutate],
  )

  const download = useCallback(async (message: IMessage) => {
    setError(undefined)
    try {
      const saved = await downloadFile(ApiRoutes.CHAT_FILE(message.id), message.fileName)
      await revealFile(saved)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : undefined)
    }
  }, [])

  const handleDownload = useCallback((message: IMessage) => void download(message), [download])

  return { sendFiles, handleDownload, pending: upload.isPending, error }
}
