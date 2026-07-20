import type { ApiError } from '../api/errors';

export function isNotFoundError(error: ApiError): boolean {
  return error.status === 404 || error.code === 'NOT_FOUND';
}

export function getTicketErrorTitle(error: ApiError): string {
  return isNotFoundError(error) ? 'Ticket not found' : 'Unable to load ticket';
}
