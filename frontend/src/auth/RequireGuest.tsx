import { Navigate, Outlet } from 'react-router'

import { FullPageLoader } from '../components/FullPageLoader'
import { ROUTES } from '../config/app'
import { useAuth } from './useAuth'

/**
 * Keeps already signed-in users off the sign-in screen.
 */
export const RequireGuest = () => {
  const { status } = useAuth()

  if (status === 'checking') {
    return <FullPageLoader />
  }

  if (status === 'authenticated') {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
