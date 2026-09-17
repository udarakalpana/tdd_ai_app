import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router'

import { AuthProvider } from './auth/AuthProvider'
import { RequireAuth } from './auth/RequireAuth'
import { RequireGuest } from './auth/RequireGuest'
import { ROUTES } from './config/app'
import { DashboardLayout } from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import SignInPage from './pages/SignInPage'

/** Session state has to sit above the guards, so it wraps the whole tree. */
const RootLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
)

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
      {
        element: <RequireGuest />,
        children: [{ path: ROUTES.signIn, element: <SignInPage /> }],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: ROUTES.dashboard, element: <DashboardPage /> }],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

const App = () => <RouterProvider router={router} />

export default App
