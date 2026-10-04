import type { NormalizedApiError } from '../utils/api/apiClient'
import type { AuthenticatedUser, RequestStatus, SignInResponse } from './api'

/**
 * `checking` covers the first paint, while a restored token is verified against
 * the API. Guards render a loader instead of flashing the wrong screen.
 */
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

export type AuthState = {
  user: AuthenticatedUser | null
  token: string | null
  /** False for a session rehydrated from storage until `/api/user` accepts it. */
  isSessionVerified: boolean
  signInStatus: RequestStatus
  signInError: NormalizedApiError | null
}

export type SignInResult = Pick<SignInResponse['data'], 'token' | 'user'>
