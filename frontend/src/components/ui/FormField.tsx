import { getFieldErrorId } from "./field";
import type { FormFieldProps } from "../../types/task.ts";

/**
 * Label, control and error message layout shared by every form field.
 */
export const FormField = ({
    id,
    label,
    error,
    isOptional = false,
    children,
}: FormFieldProps) => (
    <div className="flex flex-col gap-1.5">
        <label
            htmlFor={id}
            className="flex items-baseline justify-between gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
        >
            {label}
            {isOptional && (
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                    Optional
                </span>
            )}
        </label>

        {children}

        {error && (
            <p
                id={getFieldErrorId(id)}
                role="alert"
                className="text-sm text-rose-600 dark:text-rose-400"
            >
                {error}
            </p>
        )}
    </div>
);
