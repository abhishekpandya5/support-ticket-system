/**
 * Application route path constants.
 * Use these instead of hard-coded path strings across the app.
 */
export const ROUTES = {
  dashboard: '/',
  tickets: '/tickets',
  ticketCreate: '/tickets/new',
  ticketDetail: (id: string) => `/tickets/${id}`,
} as const;

export type AppRoutePath =
  | typeof ROUTES.dashboard
  | typeof ROUTES.tickets
  | typeof ROUTES.ticketCreate
  | `/tickets/${string}`;

export const NAV_ITEMS = [
  { label: 'Dashboard', to: ROUTES.dashboard },
  { label: 'Tickets', to: ROUTES.tickets },
  { label: 'Create Ticket', to: ROUTES.ticketCreate },
] as const;
