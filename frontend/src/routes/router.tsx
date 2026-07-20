import { createBrowserRouter } from 'react-router-dom';

import { RouteErrorBoundary } from '../components/common/RouteErrorBoundary';
import { MainLayout } from '../components/layout/MainLayout';
import { lazyPage, withSuspense } from './lazyRoute';
import { ROUTE_PATTERNS, ROUTES } from './paths';

const DashboardPage = lazyPage(() => import('../pages/DashboardPage'));
const TicketListPage = lazyPage(() => import('../pages/tickets/TicketListPage'));
const TicketCreatePage = lazyPage(
  () => import('../pages/tickets/CreateTicketPage'),
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
    errorElement: <RouteErrorBoundary />,
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
        path: ROUTE_PATTERNS.ticketEdit,
        Component: withSuspense(EditTicketPage),
      },
      {
        path: ROUTE_PATTERNS.ticketDetail,
        Component: withSuspense(TicketDetailPage),
      },
      {
        path: '*',
        Component: withSuspense(NotFoundPage),
      },
    ],
  },
]);
