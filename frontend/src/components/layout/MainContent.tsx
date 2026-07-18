import type { ReactNode } from 'react';

type MainContentProps = {
  children?: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </div>
    </main>
  );
}
