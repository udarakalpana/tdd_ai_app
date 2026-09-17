/**
 * Builds up to two uppercase initials from a display name for avatar fallbacks.
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  const [first, second] = parts

  return `${first.charAt(0)}${parts.length > 1 ? second.charAt(0) : ''}`.toUpperCase()
}
