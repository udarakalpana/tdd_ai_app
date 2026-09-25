import { Navigate, RouterProvider, createBrowserRouter } from 'react-router'

import { RequireAuth } from './auth/RequireAuth'
import { RequireGuest } from './auth/RequireGuest'
import { ROUTES } from './config/app'
import { DashboardLayout } from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import SignInPage from './pages/SignInPage'

const router = createBrowserRouter([
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
])

const App = () => <RouterProvider router={router} />

export default App
