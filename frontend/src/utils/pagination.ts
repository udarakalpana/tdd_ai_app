import type { PageNumberItem } from "../types/ui";

/** Pages shown on each side of the current one before the rest collapse. */
const SIBLING_PAGES = 1;

/**
 * Reads the `?page=` query value, falling back to the first page for anything
 * that is not a positive whole number.
 */
export const toPageNumber = (value: string | null): number => {
    const page = Number(value);

    return Number.isInteger(page) && page > 0 ? page : 1;
};

/**
 * Page buttons to render: always the first and last page, the current page
 * with its neighbours, and an ellipsis wherever a run of pages is skipped.
 */
export const getPageNumberItems = (
    currentPage: number,
    lastPage: number,
): PageNumberItem[] => {
    const items: PageNumberItem[] = [];

    for (let page = 1; page <= lastPage; page++) {
        const isEdge = page === 1 || page === lastPage;
        const isNearCurrent = Math.abs(page - currentPage) <= SIBLING_PAGES;

        if (isEdge || isNearCurrent) {
            items.push(page);
        } else if (items.at(-1) !== "ellipsis") {
            items.push("ellipsis");
        }
    }

    return items;
};
