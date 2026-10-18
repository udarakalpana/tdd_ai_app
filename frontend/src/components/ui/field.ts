import { cn } from "../../utils/cn";
import {
    CONTROL_BASE_CLASSES,
    CONTROL_ERROR_CLASSES,
    CONTROL_VALID_CLASSES,
} from "../../utils/constants/field_style.ts";
/**
 * Shared look of every form control (input, textarea, select) so they stay
 * visually identical in both states.
 */
export const getFieldControlClasses = (hasError: boolean): string =>
    cn(
        CONTROL_BASE_CLASSES,
        hasError ? CONTROL_ERROR_CLASSES : CONTROL_VALID_CLASSES,
    );

/** Id of the element holding a field's error, for `aria-describedby`. */
export const getFieldErrorId = (fieldId: string): string => `${fieldId}-error`;
