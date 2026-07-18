import type { ReactNode } from 'react';

import { AppHeader } from './AppHeader';
import { MainContent } from './MainContent';

type AppLayoutProps = {
  children?: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <MainContent>{children}</MainContent>
    </div>
  );
}
