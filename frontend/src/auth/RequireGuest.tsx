import { Navigate, Outlet, useLocation } from 'react-router'

import { FullPageLoader } from '../components/FullPageLoader'
import { ROUTES } from '../config/app'
import { useAppSelector } from '../store/hooks'
import { selectAuthStatus } from './authSlice'

/**
 * Keeps already signed-in users off the sign-in screen. The moment a sign in is
 * fulfilled this sends the visitor on to wherever `RequireAuth` bounced them from.
 */
export const RequireGuest = () => {
  const status = useAppSelector(selectAuthStatus)
  const location = useLocation()

  if (status === 'checking') {
    return <FullPageLoader />
  }

  if (status === 'authenticated') {
    const redirectTo =
      (location.state as { from?: string } | null)?.from ?? ROUTES.dashboard

    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
