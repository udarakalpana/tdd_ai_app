import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'

import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

/**
 * Application shell for signed-in routes: fixed navbar, sidebar, content outlet.
 */
export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const [renderedPath, setRenderedPath] = useState(location.pathname)

  /**
   * Navigating on mobile should dismiss the drawer. Adjusting during render
   * avoids the extra paint an effect would cause.
   */
  if (renderedPath !== location.pathname) {
    setRenderedPath(location.pathname)
    setIsSidebarOpen(false)
  }

  /** While the drawer covers the page, Escape closes it and the page behind it stays put. */
  useEffect(() => {
    if (!isSidebarOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSidebarOpen])

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="pt-16 lg:pl-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
