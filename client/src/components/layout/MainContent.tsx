import type { ReactNode } from 'react';

type MainContentProps = {
  children?: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return (
    <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </div>
    </main>
  );
}
