import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ApiError } from './errors';
import { getApiBaseUrl } from './env';
import type { ApiErrorResponseBody } from './types';

const REQUEST_ID_HEADER = 'x-request-id';

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function attachRequestId(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const headers = config.headers;

  if (!headers.get(REQUEST_ID_HEADER)) {
    headers.set(REQUEST_ID_HEADER, createRequestId());
  }

  return config;
}

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 500;
  const body = error.response?.data as ApiErrorResponseBody | undefined;

  if (body?.error) {
    return new ApiError(status, body.error, body.requestId);
  }

  if (status === 502 && import.meta.env.DEV) {
    return new ApiError(status, {
      code: 'INTERNAL_ERROR',
      message:
        'API server unavailable. Start the backend (npm run dev in backend/) and ensure VITE_API_PROXY_TARGET in frontend/.env.local matches its port.',
    });
  }

  if (error.code === 'ECONNABORTED') {
    return new ApiError(
      status,
      {
        code: 'INTERNAL_ERROR',
        message: 'Request timed out',
      },
    );
  }

  return new ApiError(status, {
    code: 'INTERNAL_ERROR',
    message: error.message || 'An unexpected network error occurred',
  });
}

/**
 * Shared Axios instance for all API calls.
 * Base URL comes from `VITE_API_BASE_URL` (see `api/env.ts`).
 */
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(attachRequestId);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(toApiError(error)),
);

export { REQUEST_ID_HEADER };
