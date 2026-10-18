import type {
    InputHTMLAttributes,
    ReactNode,
    Ref,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";
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

export type TextareaFieldProps = Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "id"
> & {
    id: string;
    label: string;
    /** Rendered under the field and announced to screen readers. */
    error?: string;
    /** Adds an "Optional" hint next to the label. */
    isOptional?: boolean;
    ref?: Ref<HTMLTextAreaElement>;
};

export type TextFieldProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "id"
> & {
    id: string;
    label: string;
    /** Rendered under the field and announced to screen readers. */
    error?: string;
    /** Adds an "Optional" hint next to the label. */
    isOptional?: boolean;
    /** Rendered inside the field's trailing edge, e.g. a visibility toggle. */
    trailing?: ReactNode;
    ref?: Ref<HTMLInputElement>;
};
