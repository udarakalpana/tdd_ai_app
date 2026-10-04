import type { SVGProps } from 'react'

/** Open eye on a 24x24 grid, drawn in `currentColor`. */
export const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M2.5 12C3.8 8.4 7.4 4.9 12 4.9s8.2 3.5 9.5 7.1c-1.3 3.6-4.9 7.1-9.5 7.1S3.8 15.6 2.5 12Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)
