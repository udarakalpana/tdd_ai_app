import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { setBearerToken, setUnauthorizedHandler } from '../lib/apiClient'
import type { AuthenticatedUser, SignInCredentials } from '../types/api'
import { AuthContext, type AuthStatus } from './AuthContext'
import { fetchCurrentUser, requestSignIn } from './authApi'
import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
} from './authStorage'

type SessionState = {
  status: AuthStatus
  user: AuthenticatedUser | null
}

type AuthProviderProps = {
  children: ReactNode
}

/**
 * Seeds state from `localStorage` so a returning visitor renders the loader —
 * not the sign-in screen — while their token is verified.
 */
const readInitialSession = (): SessionState => {
  const storedSession = readStoredSession()

  return storedSession
    ? { status: 'checking', user: storedSession.user }
    : { status: 'unauthenticated', user: null }
}

/**
 * Owns the session: restores it on boot, exposes sign in / sign out, and keeps
 * the axios bearer token in sync with React state.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<SessionState>(readInitialSession)

  const signOut = useCallback((): void => {
    clearStoredSession()
    setBearerToken(null)
    setSession({ status: 'unauthenticated', user: null })
  }, [])

  const signIn = useCallback(
    async (credentials: SignInCredentials): Promise<AuthenticatedUser> => {
      const { token, user } = await requestSignIn(credentials)

      writeStoredSession({ token, user })
      setBearerToken(token)
      setSession({ status: 'authenticated', user })

      return user
    },
    [],
  )

  /** A 401 from any request means the stored token is no longer usable. */
  useEffect(() => {
    setUnauthorizedHandler(signOut)

    return () => setUnauthorizedHandler(null)
  }, [signOut])

  /** Confirm a restored token still works before unlocking guarded routes. */
  useEffect(() => {
    const storedSession = readStoredSession()

    if (!storedSession) {
      return
    }

    let isCurrent = true

    setBearerToken(storedSession.token)

    fetchCurrentUser()
      .then((currentUser) => {
        if (!isCurrent) {
          return
        }

        writeStoredSession({ token: storedSession.token, user: currentUser })
        setSession({ status: 'authenticated', user: currentUser })
      })
      .catch(() => {
        if (isCurrent) {
          signOut()
        }
      })

    return () => {
      isCurrent = false
    }
  }, [signOut])

  const value = useMemo(
    () => ({
      status: session.status,
      user: session.user,
      isAuthenticated: session.status === 'authenticated',
      signIn,
      signOut,
    }),
    [session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
