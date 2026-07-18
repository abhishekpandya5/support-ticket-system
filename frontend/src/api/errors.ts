import type { ApiErrorCode, ApiErrorEnvelope } from './types';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly requestId?: string;
  readonly details?: Record<string, unknown>;

  constructor(
    status: number,
    envelope: ApiErrorEnvelope,
    requestId?: string,
  ) {
    super(envelope.message);
    this.name = 'ApiError';
    this.code = envelope.code;
    this.status = status;
    this.details = envelope.details;

    if (requestId !== undefined) {
      this.requestId = requestId;
    }
  }

  get fieldErrors(): Record<string, string> | undefined {
    const fields = this.details?.fields;

    if (typeof fields !== 'object' || fields === null) {
      return undefined;
    }

    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string') {
        result[key] = value;
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
