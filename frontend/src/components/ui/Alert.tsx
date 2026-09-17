import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

type AlertProps = {
  children: ReactNode
  className?: string
}

/**
 * Form-level error banner. Uses `role="alert"` so the message is announced the
 * moment it appears, which is how a failed submit should read to a screen reader.
 */
export const Alert = ({ children, className }: AlertProps) => (
  <div
    role="alert"
    className={cn(
      'flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
      className,
    )}
  >
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-px size-5 shrink-0 text-rose-500 dark:text-rose-400"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM10 5.25a.9.9 0 0 1 .9.9v4.4a.9.9 0 0 1-1.8 0v-4.4a.9.9 0 0 1 .9-.9Zm0 9.75a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z"
        clipRule="evenodd"
      />
    </svg>
    <span>{children}</span>
  </div>
)
