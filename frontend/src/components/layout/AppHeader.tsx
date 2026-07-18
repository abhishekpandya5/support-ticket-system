import { useState } from 'react';

import { AppNavigation } from './AppNavigation';

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white"
          >
            ST
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              Support Tickets
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Ticket management
            </p>
          </div>
        </div>

        <div className="hidden md:block">
          <AppNavigation />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <MenuIcon open={mobileMenuOpen} />
        </button>
      </div>

      {mobileMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          <AppNavigation onNavigate={closeMobileMenu} />
        </div>
      ) : null}
    </header>
  );
}
