import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout';
import { lazyPage, withSuspense } from './lazyRoute';
import { ROUTES } from './paths';

const DashboardPage = lazyPage(() => import('../pages/DashboardPage'));
const TicketListPage = lazyPage(() => import('../pages/tickets/TicketListPage'));
const TicketCreatePage = lazyPage(
  () => import('../pages/tickets/TicketCreatePage'),
);
const TicketDetailPage = lazyPage(
  () => import('../pages/tickets/TicketDetailPage'),
);
const EditTicketPage = lazyPage(
  () => import('../pages/tickets/EditTicketPage'),
);
const NotFoundPage = lazyPage(() => import('../pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        Component: withSuspense(DashboardPage),
      },
      {
        path: ROUTES.tickets,
        Component: withSuspense(TicketListPage),
      },
      {
        path: ROUTES.ticketCreate,
        Component: withSuspense(TicketCreatePage),
      },
      {
        path: '/tickets/:id/edit',
        Component: withSuspense(EditTicketPage),
      },
      {
        path: '/tickets/:id',
        Component: withSuspense(TicketDetailPage),
      },
      {
        path: '*',
        Component: withSuspense(NotFoundPage),
      },
    ],
  },
]);
