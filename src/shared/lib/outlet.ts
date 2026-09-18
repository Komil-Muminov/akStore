import { useSyncExternalStore } from 'react'
import { storage } from './storage'

const STORAGE_KEY = 'outlet'

type TListener = () => void

let current: string | null = null
let restored = false
const listeners = new Set<TListener>()

const emit = () => listeners.forEach((listener) => listener())

const subscribe = (listener: TListener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const outletScope = {
  get: (): string | null => current,
  set: (next: string | null) => {
    current = next
    emit()
    void (next ? storage.write(STORAGE_KEY, next) : storage.remove(STORAGE_KEY))
  },
  restore: async () => {
    if (restored) return current
    restored = true
    current = await storage.read(STORAGE_KEY)
    emit()
    return current
  },
}

export const useOutletScope = (): string | null => useSyncExternalStore(subscribe, outletScope.get, outletScope.get)
