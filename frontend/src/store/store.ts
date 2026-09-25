import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
/* The ES build — the CommonJS `lib/` default export does not survive bundling. */
import storage from 'redux-persist/es/storage'

import { authReducer, restoreSession, selectAuthToken, signOut } from '../auth/authSlice'
import { setAuthTokenResolver, setUnauthorizedHandler } from '../lib/apiClient'

/**
 * Only the session itself survives a reload. Request state (`signInStatus`,
 * `signInError`) and `isSessionVerified` always start fresh.
 */
const authPersistConfig = {
  key: 'tracker.auth',
  storage,
  whitelist: ['user', 'token'],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        /* redux-persist dispatches functions on these internal actions. */
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

/** Once the stored session is rehydrated, confirm its token is still valid. */
export const persistor = persistStore(store, null, () => {
  void store.dispatch(restoreSession())
})

/** Every request reads the token straight from the store, so it is never stale. */
setAuthTokenResolver(() => selectAuthToken(store.getState()))

/** A 401 from any request means the stored token is no longer usable. */
setUnauthorizedHandler(() => {
  store.dispatch(signOut())
})

export type RootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch
