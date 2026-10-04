import type { SignInCredentials } from '../../types/api'

export const INITIAL_SIGN_IN_CREDENTIALS: SignInCredentials = {
  email: '',
  password: '',
}

export const SIGN_IN_VALIDATION_MESSAGES = {
  emailRequired: 'Enter your email address.',
  emailInvalid: 'Enter a valid email address.',
  passwordRequired: 'Enter your password.',
} as const

export const SIGN_IN_HIGHLIGHTS = [
  'Capture what needs doing in seconds.',
  'Set priorities so the important work stays visible.',
  'Follow every task from pending through to done.',
] as const
