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

/** Lifecycle of a single async request tracked in the store. */
export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected'

/** Body of a single Laravel `JsonResource` response: `{ data: T }`. */
export type ApiResource<T> = {
  data: T
}

/** `meta` block Laravel adds to a paginated resource collection. */
export type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  /** Position of the first item on the page, or `null` when the page is empty. */
  from: number | null
  /** Position of the last item on the page, or `null` when the page is empty. */
  to: number | null
}

/** Body of a paginated Laravel resource collection: `{ data: T[], meta }`. */
export type PaginatedApiResource<T> = {
  data: T[]
  meta: PaginationMeta
}
