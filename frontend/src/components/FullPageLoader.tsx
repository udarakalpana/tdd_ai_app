import { Logo } from './Logo'
import { Spinner } from './ui/Spinner'

type FullPageLoaderProps = {
  label?: string
}

/**
 * Shown while the stored session is verified, so guarded routes never flash
 * the sign-in screen for an already authenticated user.
 */
export const FullPageLoader = ({
  label = 'Restoring your session…',
}: FullPageLoaderProps) => (
  <div
    className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-slate-50 px-6 dark:bg-slate-950"
    role="status"
    aria-live="polite"
  >
    <Logo />
    <span className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
      <Spinner className="size-4 text-brand-600 dark:text-brand-400" />
      {label}
    </span>
  </div>
)
