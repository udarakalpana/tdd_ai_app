import type { SVGProps } from 'react'

/** Struck-through eye on a 24x24 grid, drawn in `currentColor`. */
export const EyeOffIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8M9.4 5.2A9.6 9.6 0 0 1 12 4.9c4.6 0 8.2 3.5 9.5 7.1a12 12 0 0 1-2.9 4.2M6.3 6.7A12.3 12.3 0 0 0 2.5 12c1.3 3.6 4.9 7.1 9.5 7.1 1.5 0 2.9-.4 4.1-1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)
