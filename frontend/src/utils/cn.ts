type ClassValue = string | false | null | undefined

/**
 * Joins conditional class names, dropping the falsy ones.
 */
export const cn = (...classes: ClassValue[]): string =>
  classes.filter(Boolean).join(' ')
