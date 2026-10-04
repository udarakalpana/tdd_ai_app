import type { ReactNode } from 'react'

import { cn } from '../../utils/cn'

type AlertVariant = 'error' | 'success'

type AlertProps = {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error:
    'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
}

const ICON_CLASSES: Record<AlertVariant, string> = {
  error: 'text-rose-500 dark:text-rose-400',
  success: 'text-emerald-500 dark:text-emerald-400',
}

const ICON_PATHS: Record<AlertVariant, string> = {
  error:
    'M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM10 5.25a.9.9 0 0 1 .9.9v4.4a.9.9 0 0 1-1.8 0v-4.4a.9.9 0 0 1 .9-.9Zm0 9.75a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z',
  success:
    'M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm3.86 6.54a.9.9 0 0 0-1.32-1.22L8.9 10.76 7.43 9.2a.9.9 0 1 0-1.31 1.23l2.13 2.27a.9.9 0 0 0 1.31 0l4.3-4.66Z',
}

/**
 * Form-level banner. An error uses `role="alert"` so it is announced the moment
 * it appears; a success message uses the politer `role="status"`.
 */
export const Alert = ({ variant = 'error', children, className }: AlertProps) => (
  <div
    role={variant === 'error' ? 'alert' : 'status'}
    className={cn(
      'flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm',
      VARIANT_CLASSES[variant],
      className,
    )}
  >
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn('mt-px size-5 shrink-0', ICON_CLASSES[variant])}
      aria-hidden="true"
    >
      <path fillRule="evenodd" d={ICON_PATHS[variant]} clipRule="evenodd" />
    </svg>
    <span>{children}</span>
  </div>
)
