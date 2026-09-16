import { useSyncExternalStore } from 'react'

type TListener = () => void

let pendingCompanionId: string | null = null
const listeners = new Set<TListener>()

const emit = () => listeners.forEach((listener) => listener())

const subscribe = (listener: TListener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const chatRequest = {
  get: () => pendingCompanionId,
  open: (companionId: string) => {
    pendingCompanionId = companionId
    emit()
  },
  clear: () => {
    if (pendingCompanionId === null) return
    pendingCompanionId = null
    emit()
  },
}

export const useChatRequest = () => useSyncExternalStore(subscribe, chatRequest.get, chatRequest.get)
