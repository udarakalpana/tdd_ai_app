/**
 * Deliberately loose: it only catches obvious typos, the API stays the
 * authority on what counts as a valid address.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
