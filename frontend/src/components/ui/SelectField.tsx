import { cn } from "../../utils/cn";
import { getFieldControlClasses, getFieldErrorId } from "./field";
import { FormField } from "./FormField";
import type { SelectFieldProps } from "../../types/fields.ts";
import ArrowDown from "../../assets/svg/ArrowDown.tsx";

/**
 * Native `<select>` styled to match `TextField`. Native keeps keyboard,
 * screen reader and mobile picker behavior for free.
 */
export const SelectField = <TValue extends string>({
    id,
    label,
    options,
    value,
    onValueChange,
    error,
    className,
    ref,
    ...props
}: SelectFieldProps<TValue>) => (
    <FormField id={id} label={label} error={error}>
        <div className="relative">
            <select
                id={id}
                ref={ref}
                value={value}
                /* Only values from `options` can be selected, so the cast is safe. */
                onChange={(event) =>
                    onValueChange(event.target.value as TValue)
                }
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? getFieldErrorId(id) : undefined}
                className={cn(
                    getFieldControlClasses(Boolean(error)),
                    "appearance-none pr-10",
                    className,
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <ArrowDown />
        </div>
    </FormField>
);
