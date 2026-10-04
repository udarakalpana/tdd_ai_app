import type { RootState } from '../store/store'
import type { NormalizedApiError } from '../utils/api/apiClient'
import type { AuthenticatedUser, RequestStatus } from '../types/api'
import type { AuthState, AuthStatus } from '../types/auth'

export const selectAuth = (state: RootState): AuthState => state.auth

export const selectCurrentUser = (state: RootState): AuthenticatedUser | null =>
  selectAuth(state).user

export const selectAuthToken = (state: RootState): string | null =>
  selectAuth(state).token

export const selectAuthStatus = (state: RootState): AuthStatus => {
  const { token, user, isSessionVerified } = selectAuth(state)

  if (!token || !user) {
    return 'unauthenticated'
  }

  return isSessionVerified ? 'authenticated' : 'checking'
}

export const selectIsAuthenticated = (state: RootState): boolean =>
  selectAuthStatus(state) === 'authenticated'

export const selectSignInStatus = (state: RootState): RequestStatus =>
  selectAuth(state).signInStatus

export const selectSignInError = (state: RootState): NormalizedApiError | null =>
  selectAuth(state).signInError
