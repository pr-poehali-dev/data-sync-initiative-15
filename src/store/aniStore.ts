import { useState, useEffect, useCallback } from 'react'

export interface Bookmark {
  animeId: string
  title: string
  episode: number
  image: string
  updatedAt: number
}

interface AniStore {
  coins: number
  bookmarks: Record<string, Bookmark>
}

const STORAGE_KEY = 'anistream_store'

function loadStore(): AniStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('store load error', e)
  }
  return { coins: 150, bookmarks: {} }
}

function saveStore(store: AniStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

// Singleton state — reactive across components via custom event
let _store: AniStore = loadStore()
const STORE_EVENT = 'anistore-update'

function notify() {
  window.dispatchEvent(new Event(STORE_EVENT))
}

export function addCoins(amount: number) {
  _store = { ..._store, coins: _store.coins + amount }
  saveStore(_store)
  notify()
}

export function setBookmark(animeId: string, title: string, episode: number, image: string) {
  _store = {
    ..._store,
    bookmarks: {
      ..._store.bookmarks,
      [animeId]: { animeId, title, episode, image, updatedAt: Date.now() },
    },
  }
  saveStore(_store)
  notify()
}

export function removeBookmark(animeId: string) {
  const bm = { ..._store.bookmarks }
  delete bm[animeId]
  _store = { ..._store, bookmarks: bm }
  saveStore(_store)
  notify()
}

export function getBookmark(animeId: string): Bookmark | null {
  return _store.bookmarks[animeId] ?? null
}

export function useAniStore() {
  const [store, setStore] = useState<AniStore>(_store)

  const sync = useCallback(() => setStore({ ..._store }), [])

  useEffect(() => {
    window.addEventListener(STORE_EVENT, sync)
    return () => window.removeEventListener(STORE_EVENT, sync)
  }, [sync])

  return store
}