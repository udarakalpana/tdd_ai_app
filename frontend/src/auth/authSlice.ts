import { createSlice } from '@reduxjs/toolkit'

import { normalizeApiError } from '../utils/api/apiClient'
import type { AuthState } from '../types/auth'
import { restoreSession, signIn } from './authThunks'

const initialState: AuthState = {
  user: null,
  token: null,
  isSessionVerified: false,
  signInStatus: 'idle',
  signInError: null,
}

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
