import type { AuthenticatedUser } from '../types/api'

const TOKEN_KEY = 'tracker.auth.token'
const USER_KEY = 'tracker.auth.user'

type StoredSession = {
  token: string
  user: AuthenticatedUser
}

/**
 * `localStorage` throws in private mode and when site data is blocked, so
 * every access is guarded and a failure degrades to "no session".
 */
const safeRead = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const safeWrite = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Persisting is a convenience; the in-memory session still works.
  }
}

const safeRemove = (key: string): void => {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Nothing to do — the in-memory session is cleared regardless.
  }
}

const isAuthenticatedUser = (value: unknown): value is AuthenticatedUser => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<AuthenticatedUser>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string'
  )
}

export const readStoredSession = (): StoredSession | null => {
  const token = safeRead(TOKEN_KEY)
  const rawUser = safeRead(USER_KEY)

  if (!token || !rawUser) {
    return null
  }

  try {
    const user: unknown = JSON.parse(rawUser)

    return isAuthenticatedUser(user) ? { token, user } : null
  } catch {
    return null
  }
}

export const writeStoredSession = (session: StoredSession): void => {
  safeWrite(TOKEN_KEY, session.token)
  safeWrite(USER_KEY, JSON.stringify(session.user))
}

export const clearStoredSession = (): void => {
  safeRemove(TOKEN_KEY)
  safeRemove(USER_KEY)
}
