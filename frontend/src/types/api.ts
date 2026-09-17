/** Shape returned by `UserResource` on the Laravel side. */
export type AuthenticatedUser = {
  id: string
  name: string
  email: string
}

export type SignInCredentials = {
  email: string
  password: string
}

/** `POST /api/login` payload: `{ data: { token, token_type, user } }`. */
export type SignInResponse = {
  data: {
    token: string
    token_type: string
    user: AuthenticatedUser
  }
}

/** Laravel validation errors: field name -> list of messages. */
export type FieldErrors = Record<string, string[]>

export type LaravelErrorBody = {
  message?: string
  errors?: FieldErrors
}
