import { Navigate, Outlet, useLocation } from 'react-router'

import { FullPageLoader } from '../components/FullPageLoader'
import { ROUTES } from '../config/app'
import { useAuth } from './useAuth'

/**
 * Gate for signed-in routes. Remembers where the visitor was heading so they
 * land there after signing in instead of on a generic dashboard.
 */
export const RequireAuth = () => {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return <FullPageLoader />
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to={ROUTES.signIn}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <Outlet />
}
