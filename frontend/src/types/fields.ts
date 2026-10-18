import type { Ref, SelectHTMLAttributes } from "react";
import type { SelectOption } from "./ui.ts";

export type SelectFieldProps<TValue extends string> = Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "id" | "value" | "onChange"
> & {
    id: string;
    label: string;
    options: readonly SelectOption<TValue>[];
    value: TValue;
    /** Receives the selected option's value, already narrowed to `TValue`. */
    onValueChange: (value: TValue) => void;
    /** Rendered under the field and announced to screen readers. */
    error?: string;
    ref?: Ref<HTMLSelectElement>;
};
