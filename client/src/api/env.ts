const DEFAULT_DEV_API_BASE_URL = '/api';
const DEFAULT_PROD_API_BASE_URL = 'http://localhost:3001/api';

/**
 * Resolves the API base URL from `VITE_API_BASE_URL`.
 * In dev, defaults to `/api` so requests go through the Vite proxy (see `vite.config.ts`).
 * Trailing slashes are removed for consistent path joining.
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  return import.meta.env.DEV
    ? DEFAULT_DEV_API_BASE_URL
    : DEFAULT_PROD_API_BASE_URL;
}
