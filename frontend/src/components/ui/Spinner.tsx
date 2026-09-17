import { cn } from '../../lib/cn'

type SpinnerProps = {
  className?: string
}

export const Spinner = ({ className }: SpinnerProps) => (
  <svg
    className={cn('animate-spin', className ?? 'size-4')}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)
