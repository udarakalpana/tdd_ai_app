import type { SignInCredentials } from '../../types/api'
import type { SignInFieldErrors } from '../../types/signIn'
import { SIGN_IN_VALIDATION_MESSAGES } from '../constants/signIn'
import { isValidEmail } from './email'

/**
 * Catching empty and malformed input in the browser keeps obvious mistakes
 * from eating into the API's five-attempts-per-minute login throttle.
 */
export const validateSignInCredentials = ({
  email,
  password,
}: SignInCredentials): SignInFieldErrors => {
  const errors: SignInFieldErrors = {}

  if (!email.trim()) {
    errors.email = SIGN_IN_VALIDATION_MESSAGES.emailRequired
  } else if (!isValidEmail(email)) {
    errors.email = SIGN_IN_VALIDATION_MESSAGES.emailInvalid
  }

  if (!password) {
    errors.password = SIGN_IN_VALIDATION_MESSAGES.passwordRequired
  }

  return errors
}
