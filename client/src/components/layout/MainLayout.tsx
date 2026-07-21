import { Outlet } from 'react-router-dom';

import { SkipLink } from '../common/SkipLink';
import { AppHeader } from './AppHeader';
import { MainContent } from './MainContent';

export function MainLayout() {
  return (
    <div className="flex min-h-svh min-w-0 flex-col overflow-x-clip">
      <SkipLink />
      <AppHeader />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
}
