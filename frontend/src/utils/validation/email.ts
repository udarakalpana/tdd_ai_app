import { EMAIL_PATTERN } from '../constants/validation'

/**
 * Checks the trimmed value against the shared email pattern.
 */
export const isValidEmail = (value: string): boolean =>
  EMAIL_PATTERN.test(value.trim())
