import { useSyncExternalStore } from 'react'
import type { ISession } from '@/shared/model'
import { storage } from './storage'

const STORAGE_KEY = 'session'

type TListener = () => void

let current: ISession | null = null
let restored = false
const listeners = new Set<TListener>()

const emit = () => listeners.forEach((listener) => listener())

const subscribe = (listener: TListener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const session = {
  get: (): ISession | null => current,
  set: (next: ISession | null) => {
    current = next
    emit()
    void (next ? storage.write(STORAGE_KEY, JSON.stringify(next)) : storage.remove(STORAGE_KEY))
  },
  restore: async () => {
    if (restored) return current
    restored = true
    const raw = await storage.read(STORAGE_KEY)
    current = raw ? (JSON.parse(raw) as ISession) : null
    emit()
    return current
  },
  isRestored: () => restored,
}

export const useSession = (): ISession | null => useSyncExternalStore(subscribe, session.get, session.get)
