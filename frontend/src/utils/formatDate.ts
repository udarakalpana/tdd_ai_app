const DUE_DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
});

/**
 * Formats a `YYYY-MM-DD` date for display, e.g. "Sep 10, 2026".
 *
 * The parts are read as a local date on purpose: `new Date("2026-09-10")` is
 * UTC midnight, which shows as the previous day west of Greenwich.
 */
export const formatDueDate = (value: string): string => {
    const [year, month, day] = value.split("-").map(Number);

    return DUE_DATE_FORMAT.format(new Date(year, month - 1, day));
};
