import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { selectCurrentUser, signOut } from '../auth/authSlice'
import { Logo } from '../components/Logo'
import { ROUTES } from '../config/app'
import { cn } from '../lib/cn'
import { getInitials } from '../lib/initials'
import { useAppDispatch, useAppSelector } from '../store/hooks'

type NavbarProps = {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export const Navbar = ({ isSidebarOpen, onToggleSidebar }: NavbarProps) => {
  const user = useAppSelector(selectCurrentUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const menuContainerRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  /** A dropdown should close on an outside click and on Escape. */
  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuContainerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const handleSignOut = () => {
    setIsMenuOpen(false)
    dispatch(signOut())
    navigate(ROUTES.signIn, { replace: true })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
          aria-expanded={isSidebarOpen}
          className="grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
            aria-hidden="true"
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Logo />

        <div className="flex-1" />

        <div className="relative" ref={menuContainerRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className="flex items-center gap-2.5 rounded-xl py-1.5 pr-2 pl-1.5 transition hover:bg-slate-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-slate-800"
          >
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white"
              aria-hidden="true"
            >
              {getInitials(user?.name ?? '')}
            </span>
            <span className="hidden max-w-40 truncate text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
              {user?.name}
            </span>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className={cn(
                'size-4 text-slate-400 transition-transform motion-reduce:transition-none',
                isMenuOpen && 'rotate-180',
              )}
              aria-hidden="true"
            >
              <path
                d="m5 7.5 5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">Account menu</span>
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              aria-label="Account"
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-hidden focus-visible:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-4.5 text-slate-400"
                  aria-hidden="true"
                >
                  <path
                    d="M15 17v1.5a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H13a2 2 0 0 1 2 2V7M10 12h10m0 0-3-3m3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
