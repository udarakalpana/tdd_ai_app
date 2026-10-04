/**
 * Deliberately loose: it only catches obvious typos, the API stays the
 * authority on what counts as a valid address.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The `YYYY-MM-DD` format a native date input produces and the API expects. */
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
