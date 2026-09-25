import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { normalizeApiError, type NormalizedApiError } from '../lib/apiClient'
import type { RootState } from '../store/store'
import type { AuthenticatedUser, SignInCredentials } from '../types/api'
import { fetchCurrentUser, requestSignIn } from './authApi'

/**
 * `checking` covers the first paint, while a restored token is verified against
 * the API. Guards render a loader instead of flashing the wrong screen.
 */
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export type AuthState = {
  user: AuthenticatedUser | null
  token: string | null
  /** False for a session rehydrated from storage until `/api/user` accepts it. */
  isSessionVerified: boolean
  signInStatus: RequestStatus
  signInError: NormalizedApiError | null
}

type SignInResult = {
  token: string
  user: AuthenticatedUser
}

const initialState: AuthState = {
  user: null,
  token: null,
  isSessionVerified: false,
  signInStatus: 'idle',
  signInError: null,
}

/**
 * `POST /api/login`. Failures are normalized before they reach the store so the
 * rejected action carries a plain, serializable error the form can render.
 */
export const signIn = createAsyncThunk<
  SignInResult,
  SignInCredentials,
  { rejectValue: NormalizedApiError }
>('auth/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const { token, user } = await requestSignIn(credentials)

    return { token, user }
  } catch (error) {
    return rejectWithValue(normalizeApiError(error))
  }
})

/**
 * Confirms a token rehydrated by redux-persist still works before guarded
 * routes are unlocked. Skipped when there is nothing to verify.
 */
export const restoreSession = createAsyncThunk<
  AuthenticatedUser,
  void,
  { state: RootState }
>('auth/restoreSession', () => fetchCurrentUser(), {
  condition: (_, { getState }) => {
    const { token, isSessionVerified } = getState().auth

    return token !== null && !isSessionVerified
  },
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: () => initialState,
    clearSignInError: (state) => {
      state.signInError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.signInStatus = 'pending'
        state.signInError = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isSessionVerified = true
        state.signInStatus = 'fulfilled'
        state.signInError = null
      })
      .addCase(signIn.rejected, (state, action) => {
        state.signInStatus = 'rejected'
        state.signInError = action.payload ?? normalizeApiError(action.error)
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload
        state.isSessionVerified = true
      })
      .addCase(restoreSession.rejected, () => initialState)
  },
})

export const { signOut, clearSignInError } = authSlice.actions

export const authReducer = authSlice.reducer

export const selectCurrentUser = (state: RootState): AuthenticatedUser | null =>
  state.auth.user

export const selectAuthToken = (state: RootState): string | null =>
  state.auth.token

export const selectAuthStatus = (state: RootState): AuthStatus => {
  const { token, user, isSessionVerified } = state.auth

  if (!token || !user) {
    return 'unauthenticated'
  }

  return isSessionVerified ? 'authenticated' : 'checking'
}

export const selectIsAuthenticated = (state: RootState): boolean =>
  selectAuthStatus(state) === 'authenticated'

export const selectSignInStatus = (state: RootState): RequestStatus =>
  state.auth.signInStatus

export const selectSignInError = (state: RootState): NormalizedApiError | null =>
  state.auth.signInError
