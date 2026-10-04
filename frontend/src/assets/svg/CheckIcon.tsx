import type { SVGProps } from 'react'

/** Bold check mark on a 20x20 grid, drawn in `currentColor`. */
export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path
      d="m4 10.5 4 4 8-9"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
