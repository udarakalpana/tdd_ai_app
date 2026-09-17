import { createContext } from 'react'

import type { AuthenticatedUser, SignInCredentials } from '../types/api'

/**
 * `checking` covers the first paint, while a stored token is verified against
 * the API. Guards render a loader instead of flashing the wrong screen.
 */
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  status: AuthStatus
  user: AuthenticatedUser | null
  isAuthenticated: boolean
  signIn: (credentials: SignInCredentials) => Promise<AuthenticatedUser>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
