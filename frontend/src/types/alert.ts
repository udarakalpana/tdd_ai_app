import type { ReactNode } from "react";

export type AlertVariant = "error" | "success";

export type AlertProps = {
    variant?: AlertVariant;
    children: ReactNode;
    className?: string;
};
