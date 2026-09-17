import { APP_NAME } from '../config/app'
import { cn } from '../lib/cn'

type LogoProps = {
  /** Hides the wordmark, leaving only the brandmark. */
  markOnly?: boolean
  className?: string
  /** Inverts the wordmark for use on the dark brand panel. */
  tone?: 'default' | 'inverted'
}

export const Logo = ({
  markOnly = false,
  className,
  tone = 'default',
}: LogoProps) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-900/20">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-5"
        aria-hidden="true"
      >
        <path
          d="M4.5 12.8 9.2 17.5 19.5 7.2"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    {!markOnly && (
      <span
        className={cn(
          'text-lg font-semibold tracking-tight',
          tone === 'inverted'
            ? 'text-white'
            : 'text-slate-900 dark:text-slate-50',
        )}
      >
        {APP_NAME}
      </span>
    )}
    <span className="sr-only">{markOnly ? APP_NAME : ''}</span>
  </span>
)
