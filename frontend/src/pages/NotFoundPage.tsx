import { Link } from 'react-router'

import { useAuth } from '../auth/useAuth'
import { Logo } from '../components/Logo'
import { ROUTES } from '../config/app'

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center dark:bg-slate-950">
      <Logo />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Page not found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The page you were looking for does not exist.
        </p>
      </div>

      <Link
        to={isAuthenticated ? ROUTES.dashboard : ROUTES.signIn}
        className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
      >
        {isAuthenticated ? 'Back to dashboard' : 'Go to sign in'}
      </Link>
    </div>
  )
}

export default NotFoundPage
