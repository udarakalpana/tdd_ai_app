import type { ReactNode } from "react";

/** One entry of a `<select>`, typed by the values the field accepts. */
export type SelectOption<TValue extends string> = {
    value: TValue;
    label: string;
};

/** A page number button, or a gap standing in for the pages in between. */
export type PageNumberItem = number | "ellipsis";

export type PaginationProps = {
    currentPage: number;
    lastPage: number;
    total: number;
    from: number | null;
    to: number | null;
    /** Noun for the counted items, e.g. "tasks". */
    itemLabel: string;
    isDisabled?: boolean;
    onPageChange: (page: number) => void;
};

export type BadgeProps = {
    children: ReactNode;
    className?: string;
};
