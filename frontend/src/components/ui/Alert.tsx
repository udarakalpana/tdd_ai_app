import { cn } from "../../utils/cn";
import type { AlertProps } from "../../types/alert.ts";
import {
    ICON_CLASSES,
    ICON_PATHS,
    VARIANT_CLASSES,
} from "../../utils/constants/alert.ts";

/**
 * Form-level banner. An error uses `role="alert"` so it is announced the moment
 * it appears; a success message uses the politer `role="status"`.
 */
export const Alert = ({
    variant = "error",
    children,
    className,
}: AlertProps) => (
    <div
        role={variant === "error" ? "alert" : "status"}
        className={cn(
            "flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm",
            VARIANT_CLASSES[variant],
            className,
        )}
    >
        <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={cn("mt-px size-5 shrink-0", ICON_CLASSES[variant])}
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d={ICON_PATHS[variant]}
                clipRule="evenodd"
            />
        </svg>
        <span>{children}</span>
    </div>
);
