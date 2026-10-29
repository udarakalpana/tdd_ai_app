import type { PaginationProps } from "../../types/ui";
import { cn } from "../../utils/cn";
import { getPageNumberItems } from "../../utils/pagination";
import { Button } from "./Button";

const PAGE_BUTTON_CLASSES =
    "min-w-8 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed";

/**
 * Previous / numbered / next page controls with a "Showing 1–10 of 23" summary.
 * It holds no state: the caller owns the current page.
 */
export const Pagination = ({
    currentPage,
    lastPage,
    total,
    from,
    to,
    itemLabel,
    isDisabled = false,
    onPageChange,
}: PaginationProps) => (
    <nav
        aria-label="Pagination"
        className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
        <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
                {from ?? 0}–{to ?? 0}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
                {total}
            </span>{" "}
            {itemLabel}
        </p>

        <div className="flex items-center gap-1">
            <Button
                variant="secondary"
                size="sm"
                disabled={isDisabled || currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </Button>

            <ul className="flex items-center gap-1">
                {getPageNumberItems(currentPage, lastPage).map((item, index) =>
                    item === "ellipsis" ? (
                        <li
                            key={`ellipsis-${index}`}
                            className="px-1 text-xs text-slate-400"
                            aria-hidden="true"
                        >
                            …
                        </li>
                    ) : (
                        <li key={item}>
                            <button
                                type="button"
                                disabled={isDisabled}
                                aria-current={
                                    item === currentPage ? "page" : undefined
                                }
                                aria-label={`Page ${item}`}
                                onClick={() => onPageChange(item)}
                                className={cn(
                                    PAGE_BUTTON_CLASSES,
                                    item === currentPage
                                        ? "bg-brand-600 text-white"
                                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                )}
                            >
                                {item}
                            </button>
                        </li>
                    ),
                )}
            </ul>

            <Button
                variant="secondary"
                size="sm"
                disabled={isDisabled || currentPage >= lastPage}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </Button>
        </div>
    </nav>
);
