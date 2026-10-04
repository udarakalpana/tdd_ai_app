import type { InputHTMLAttributes, ReactNode, Ref } from 'react'

import { cn } from '../../utils/cn'
import { getFieldControlClasses, getFieldErrorId } from './field'
import { FormField } from './FormField'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string
  label: string
  /** Rendered under the field and announced to screen readers. */
  error?: string
  /** Adds an "Optional" hint next to the label. */
  isOptional?: boolean
  /** Rendered inside the field's trailing edge, e.g. a visibility toggle. */
  trailing?: ReactNode
  ref?: Ref<HTMLInputElement>
}

export const TextField = ({
  id,
  label,
  error,
  isOptional,
  trailing,
  className,
  ref,
  ...props
}: TextFieldProps) => (
  <FormField id={id} label={label} error={error} isOptional={isOptional}>
    <div className="relative">
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? getFieldErrorId(id) : undefined}
        className={cn(
          getFieldControlClasses(Boolean(error)),
          trailing ? 'pr-12' : null,
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
  </FormField>
)
