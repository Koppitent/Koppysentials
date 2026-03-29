import type { Autokalkulation, GespeicherteAutokalkulation } from '@/models/Autokalkulation'

const STORAGE_KEY = 'koppysentials.autokalkulationen.v1'

const safeParse = (value: string | null): GespeicherteAutokalkulation[] => {
  if (!value) return []

  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is GespeicherteAutokalkulation => {
      if (!item || typeof item !== 'object') return false
      const entry = item as Record<string, unknown>
      return (
        typeof entry.id === 'string' &&
        typeof entry.titel === 'string' &&
        typeof entry.erstelltAm === 'string' &&
        typeof entry.aktualisiertAm === 'string' &&
        typeof entry.kaufpreis === 'number' &&
        typeof entry.nutzungsdauer === 'number' &&
        typeof entry.kilometerprojahr === 'number' &&
        typeof entry.kwhverbrauch === 'number' &&
        typeof entry.kostenprokwh === 'number' &&
        typeof entry.versicherungprojahr === 'number'
      )
    })
  } catch {
    return []
  }
}

const loadAll = (): GespeicherteAutokalkulation[] => {
  return safeParse(window.localStorage.getItem(STORAGE_KEY))
}

const persistAll = (entries: GespeicherteAutokalkulation[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

const generateTitle = (entries: GespeicherteAutokalkulation[]) => `Kalkulation ${entries.length + 1}`

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const create = (values: Autokalkulation): GespeicherteAutokalkulation => {
  const entries = loadAll()
  const now = new Date().toISOString()

  const newEntry: GespeicherteAutokalkulation = {
    id: generateId(),
    titel: generateTitle(entries),
    erstelltAm: now,
    aktualisiertAm: now,
    ...values,
  }

  const next = [...entries, newEntry]
  persistAll(next)
  return newEntry
}

const update = (id: string, values: Autokalkulation): GespeicherteAutokalkulation | null => {
  const entries = loadAll()
  const index = entries.findIndex((entry) => entry.id === id)
  if (index < 0) return null
  const existing = entries[index]
  if (!existing) return null

  const updated: GespeicherteAutokalkulation = {
    ...existing,
    ...values,
    aktualisiertAm: new Date().toISOString(),
  }

  const next = [...entries]
  next[index] = updated
  persistAll(next)
  return updated
}

const updateTitle = (id: string, titel: string): GespeicherteAutokalkulation | null => {
  const entries = loadAll()
  const index = entries.findIndex((entry) => entry.id === id)
  if (index < 0) return null
  const existing = entries[index]
  if (!existing) return null

  const normalizedTitle = titel.trim()
  const updated: GespeicherteAutokalkulation = {
    ...existing,
    titel: normalizedTitle || existing.titel,
    aktualisiertAm: new Date().toISOString(),
  }

  const next = [...entries]
  next[index] = updated
  persistAll(next)
  return updated
}

const remove = (id: string) => {
  const entries = loadAll()
  const next = entries.filter((entry) => entry.id !== id)
  persistAll(next)
}

export const autokalkulationService = {
  loadAll,
  create,
  update,
  updateTitle,
  remove,
}
