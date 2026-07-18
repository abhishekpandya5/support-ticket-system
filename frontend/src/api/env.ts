const DEFAULT_API_BASE_URL = 'http://localhost:3001/api';

/**
 * Resolves the API base URL from `VITE_API_BASE_URL`.
 * Trailing slashes are removed for consistent path joining.
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configured) {
    return DEFAULT_API_BASE_URL;
  }

  return configured.replace(/\/+$/, '');
}
