import type { PersistStorage, StorageValue } from 'zustand/middleware'

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

export function createSafePersistStorage<T>(key: string): PersistStorage<T> {
  return {
    getItem: (name) => {
      const storage = getStorage()

      if (!storage) {
        return null
      }

      try {
        const rawValue = storage.getItem(name)

        if (!rawValue) {
          return null
        }

        return JSON.parse(rawValue) as StorageValue<T>
      } catch {
        storage.removeItem(name)

        if (name !== key) {
          storage.removeItem(key)
        }

        return null
      }
    },
    setItem: (name, value) => {
      const storage = getStorage()

      if (!storage) {
        return
      }

      storage.setItem(name, JSON.stringify(value))
    },
    removeItem: (name) => {
      const storage = getStorage()

      if (!storage) {
        return
      }

      storage.removeItem(name)
    },
  }
}
