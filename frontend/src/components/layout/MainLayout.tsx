import { Outlet } from 'react-router-dom';

import { AppHeader } from './AppHeader';
import { MainContent } from './MainContent';

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
}
