import type { BadgeProps } from "../../types/ui";
import { cn } from "../../utils/cn";

/**
 * Small pill for a short value such as a status. Colours come from the caller.
 */
export const Badge = ({ children, className }: BadgeProps) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
            className,
        )}
    >
        {children}
    </span>
);
