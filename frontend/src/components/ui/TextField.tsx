import { cn } from "../../utils/cn";
import { getFieldControlClasses, getFieldErrorId } from "./field";
import { FormField } from "./FormField";
import type { TextFieldProps } from "../../types/fields.ts";

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
                    trailing ? "pr-12" : null,
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
);
