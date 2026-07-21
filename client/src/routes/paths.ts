/**
 * Application route path constants.
 * Use these instead of hard-coded path strings across the app.
 */
export const ROUTES = {
  dashboard: '/',
  tickets: '/tickets',
  ticketCreate: '/tickets/new',
  ticketDetail: (id: string) => `/tickets/${id}`,
  ticketEdit: (id: string) => `/tickets/${id}/edit`,
} as const;

/** React Router path patterns for dynamic segments. */
export const ROUTE_PATTERNS = {
  ticketDetail: ROUTES.ticketDetail(':id'),
  ticketEdit: ROUTES.ticketEdit(':id'),
} as const;

export type AppRoutePath =
  | typeof ROUTES.dashboard
  | typeof ROUTES.tickets
  | typeof ROUTES.ticketCreate
  | `/tickets/${string}`
  | `/tickets/${string}/edit`;

export const NAV_ITEMS = [
  { label: 'Dashboard', to: ROUTES.dashboard },
  { label: 'Tickets', to: ROUTES.tickets },
  { label: 'Create Ticket', to: ROUTES.ticketCreate },
] as const;
