import { apiClient } from '../lib/apiClient'
import type {
  AuthenticatedUser,
  SignInCredentials,
  SignInResponse,
} from '../types/api'

/**
 * `POST /api/login` — returns the personal access token plus the signed in user.
 */
export const requestSignIn = async (
  credentials: SignInCredentials,
): Promise<SignInResponse['data']> => {
  const { data } = await apiClient.post<SignInResponse>('/login', credentials)

  return data.data
}

/**
 * `GET /api/user` — used to confirm a restored token is still valid.
 * The endpoint returns the raw user model, so only the fields we rely on are kept.
 */
export const fetchCurrentUser = async (): Promise<AuthenticatedUser> => {
  const { data } = await apiClient.get<AuthenticatedUser>('/user')

  return { id: data.id, name: data.name, email: data.email }
}
