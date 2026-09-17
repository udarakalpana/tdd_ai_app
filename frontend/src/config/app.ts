/**
 * Single source of truth for product naming and API configuration so the
 * shell can be rebranded or repointed without touching component code.
 */
export const APP_NAME = 'Tracker'

export const APP_TAGLINE = 'Personal task tracking'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

export const ROUTES = {
  signIn: '/sign-in',
  dashboard: '/dashboard',
} as const
