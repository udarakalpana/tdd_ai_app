import type { InputHTMLAttributes, ReactNode, Ref } from 'react'

import { cn } from '../../lib/cn'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string
  label: string
  /** Rendered under the field and announced to screen readers. */
  error?: string
  /** Rendered inside the field's trailing edge, e.g. a visibility toggle. */
  trailing?: ReactNode
  ref?: Ref<HTMLInputElement>
}

export const TextField = ({
  id,
  label,
  error,
  trailing,
  className,
  ref,
  ...props
}: TextFieldProps) => {
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:outline-hidden focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500',
            trailing ? 'pr-12' : null,
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/40 dark:border-rose-500/70'
              : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/40 dark:border-slate-700 dark:focus:border-brand-400',
            className,
          )}
          {...props}
        />

        {trailing && (
          <span className="absolute inset-y-0 right-1.5 flex items-center">
            {trailing}
          </span>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-rose-600 dark:text-rose-400"
        >
          {error}
        </p>
      )}
    </div>
  )
}
