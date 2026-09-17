import { NavLink } from 'react-router'

import { Logo } from '../components/Logo'
import { cn } from '../lib/cn'
import { NAVIGATION_ITEMS, type NavigationItem } from './navigation'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

const linkClasses = ({ isActive }: { isActive: boolean }): string =>
  cn(
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500',
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100',
  )

const NavigationLink = ({ item }: { item: NavigationItem }) => (
  <NavLink to={item.to} className={linkClasses} end>
    {({ isActive }) => (
      <>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn(
            'size-5 shrink-0 transition',
            isActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300',
          )}
          aria-hidden="true"
        >
          <path d={item.iconPath} />
        </svg>
        {item.label}
      </>
    )}
  </NavLink>
)

const NavigationList = () => (
  <nav aria-label="Main" className="flex flex-1 flex-col gap-1 p-4">
    <p className="px-3 pt-1 pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
      Workspace
    </p>
    {NAVIGATION_ITEMS.map((item) => (
      <NavigationLink key={item.to} item={item} />
    ))}
  </nav>
)

/**
 * Persistent rail from `lg` upwards, off-canvas drawer below it.
 */
export const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    <aside className="hidden border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:top-16 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col dark:border-slate-800 dark:bg-slate-900">
      <NavigationList />
    </aside>

    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        !isOpen && 'pointer-events-none',
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close navigation"
        onClick={onClose}
        className={cn(
          'absolute inset-0 h-full w-full cursor-default bg-slate-950/50 backdrop-blur-xs transition-opacity duration-200 motion-reduce:transition-none',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        role="dialog"
        aria-modal={isOpen || undefined}
        aria-label="Navigation"
        className={cn(
          'absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <Logo />
          <button
            type="button"
            tabIndex={isOpen ? 0 : -1}
            onClick={onClose}
            aria-label="Close navigation"
            className="grid size-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              aria-hidden="true"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <NavigationList />
      </div>
    </div>
  </>
)
