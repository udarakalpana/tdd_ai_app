import { cn } from "../../utils/cn";
import { getFieldControlClasses, getFieldErrorId } from "./field";
import { FormField } from "./FormField";
import type { TextareaFieldProps } from "../../types/fields.ts";

export const TextareaField = ({
    id,
    label,
    error,
    isOptional,
    className,
    ref,
    rows = 4,
    ...props
}: TextareaFieldProps) => (
    <FormField id={id} label={label} error={error} isOptional={isOptional}>
        <textarea
            id={id}
            ref={ref}
            rows={rows}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? getFieldErrorId(id) : undefined}
            className={cn(
                getFieldControlClasses(Boolean(error)),
                "resize-y",
                className,
            )}
            {...props}
        />
    </FormField>
);
