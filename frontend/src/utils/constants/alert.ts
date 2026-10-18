import type { AlertVariant } from "../../types/alert.ts";

export const VARIANT_CLASSES: Record<AlertVariant, string> = {
    error: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200",
    success:
        "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
};

export const ICON_CLASSES: Record<AlertVariant, string> = {
    error: "text-rose-500 dark:text-rose-400",
    success: "text-emerald-500 dark:text-emerald-400",
};

export const ICON_PATHS: Record<AlertVariant, string> = {
    error: "M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM10 5.25a.9.9 0 0 1 .9.9v4.4a.9.9 0 0 1-1.8 0v-4.4a.9.9 0 0 1 .9-.9Zm0 9.75a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z",
    success:
        "M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm3.86 6.54a.9.9 0 0 0-1.32-1.22L8.9 10.76 7.43 9.2a.9.9 0 1 0-1.31 1.23l2.13 2.27a.9.9 0 0 0 1.31 0l4.3-4.66Z",
};
