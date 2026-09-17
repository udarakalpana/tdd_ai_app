import { ROUTES } from '../config/app'

export type NavigationItem = {
  label: string
  to: string
  /** Inline SVG path data for the item's 24x24 icon. */
  iconPath: string
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    to: ROUTES.dashboard,
    iconPath:
      'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z',
  },
]
