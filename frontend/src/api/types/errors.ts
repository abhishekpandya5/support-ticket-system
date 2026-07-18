/**
 * Error envelope from `api-contract.md` §3 and `backend/src/utils/errorResponse.ts`.
 */

/** `backend/src/constants/errorCodes.ts` */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_STATUS_TRANSITION'
  | 'STATUS_UPDATE_NOT_ALLOWED'
  | 'INVALID_OBJECT_ID'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

/** `api-contract.md` §3.1 */
export interface ApiErrorEnvelope {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

/** Error response body including request correlation id from the backend middleware. */
export interface ApiErrorResponseBody {
  requestId: string;
  error: ApiErrorEnvelope;
}
