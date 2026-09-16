import { useEffect } from 'react'
import { socketClient } from '@/shared/lib'
import type { IChatEvent } from '@/shared/model'

export const useSocketEvent = (handler: (event: IChatEvent) => void) => {
  useEffect(() => socketClient.subscribe(handler), [handler])
}
