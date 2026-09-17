import axios, { AxiosError, AxiosHeaders } from 'axios'

import { API_BASE_URL } from '../config/app'
import type { FieldErrors, LaravelErrorBody } from '../types/api'

/**
 * Shared axios instance for the Laravel API.
 *
 * `Accept: application/json` matters: without it Laravel answers validation
 * failures with a redirect instead of a 422 JSON body.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let bearerToken: string | null = null
let onUnauthorized: (() => void) | null = null

/**
 * Keeps the bearer token in one place so every request — including ones fired
 * before React has re-rendered — uses the current value.
 */
export const setBearerToken = (token: string | null): void => {
  bearerToken = token
}

/**
 * Registers the callback used when the API rejects our token (expired,
 * revoked, or cleared server-side).
 */
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  onUnauthorized = handler
}

apiClient.interceptors.request.use((config) => {
  if (bearerToken) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${bearerToken}`)
    config.headers = headers
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      onUnauthorized?.()
    }

    return Promise.reject(error)
  },
)

export type NormalizedApiError = {
  /** Human-readable message safe to render in the UI. */
  message: string
  /** Per-field validation messages, empty when the failure was not a 422. */
  fieldErrors: FieldErrors
  /** HTTP status, or `undefined` when the request never reached the server. */
  status?: number
  /** True when the credentials themselves were rejected (422). */
  isValidationError: boolean
  /** True when the login rate limiter kicked in (429). */
  isRateLimited: boolean
}

const GENERIC_MESSAGE = 'Something went wrong. Please try again.'

const describeRetryDelay = (retryAfter: unknown): string => {
  const seconds = Number(retryAfter)

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return 'in a moment'
  }

  if (seconds < 60) {
    return `in ${Math.ceil(seconds)} second${Math.ceil(seconds) === 1 ? '' : 's'}`
  }

  const minutes = Math.ceil(seconds / 60)

  return `in ${minutes} minute${minutes === 1 ? '' : 's'}`
}

/**
 * Turns anything axios throws into a predictable object the UI can render,
 * so components never have to reach into `error.response.data` themselves.
 */
export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (!axios.isAxiosError(error)) {
    return {
      message: GENERIC_MESSAGE,
      fieldErrors: {},
      isValidationError: false,
      isRateLimited: false,
    }
  }

  const { response } = error as AxiosError<LaravelErrorBody>

  if (!response) {
    const message =
      error.code === 'ECONNABORTED'
        ? 'The server took too long to respond. Please try again.'
        : 'We could not reach the server. Check your connection and try again.'

    return {
      message,
      fieldErrors: {},
      isValidationError: false,
      isRateLimited: false,
    }
  }

  const status = response.status
  const fieldErrors = response.data?.errors ?? {}

  if (status === 429) {
    const retryAfter = describeRetryDelay(response.headers?.['retry-after'])

    return {
      message: `Too many sign-in attempts. Please try again ${retryAfter}.`,
      fieldErrors: {},
      status,
      isValidationError: false,
      isRateLimited: true,
    }
  }

  const firstFieldError = Object.values(fieldErrors)[0]?.[0]
  const message = response.data?.message ?? firstFieldError ?? GENERIC_MESSAGE

  return {
    message: status >= 500 ? GENERIC_MESSAGE : message,
    fieldErrors,
    status,
    isValidationError: status === 422,
    isRateLimited: false,
  }
}
