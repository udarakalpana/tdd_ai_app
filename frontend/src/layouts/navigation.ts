import { ROUTES } from '../utils/constants/app'

export type NavigationItem = {
  label: string
  to: string
  /** Inline SVG path data for the item's 24x24 icon. */
  iconPath: string
}

export type NavigationSection = {
  title: string
  items: NavigationItem[]
}

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    title: 'Workspace',
    items: [
      {
        label: 'Dashboard',
        to: ROUTES.dashboard,
        iconPath:
          'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z',
      },
    ],
  },
  {
    title: 'Task management',
    items: [
      {
        label: 'Create task',
        to: ROUTES.taskCreate,
        iconPath:
          'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm1 5v3h3v2h-3v3h-2v-3H8v-2h3V8h2Z',
      },
    ],
  },
]
