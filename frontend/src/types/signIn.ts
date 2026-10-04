import type { SignInCredentials } from './api'

export type SignInField = keyof SignInCredentials

/** Client-side validation messages keyed by the field they belong to. */
export type SignInFieldErrors = Partial<Record<SignInField, string>>
