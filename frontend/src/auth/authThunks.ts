import { createAsyncThunk } from '@reduxjs/toolkit'

import { normalizeApiError, type NormalizedApiError } from '../utils/api/apiClient'
import { fetchCurrentUser, requestSignIn } from '../utils/api/authApi'
import type { RootState } from '../store/store'
import type { AuthenticatedUser, SignInCredentials } from '../types/api'
import type { SignInResult } from '../types/auth'

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
