import { ERROR_CODES } from '../constants/errorCodes.js';

export class InvalidTransitionError extends Error {
  readonly code = ERROR_CODES.INVALID_STATUS_TRANSITION;
  readonly currentStatus: string;
  readonly requestedStatus: string;
  readonly allowedTransitions: readonly string[];

  constructor(
    currentStatus: string,
    requestedStatus: string,
    allowedTransitions: readonly string[],
    message?: string,
  ) {
    super(
      message ??
        `Cannot transition from '${currentStatus}' to '${requestedStatus}'.`,
    );
    this.name = 'InvalidTransitionError';
    this.currentStatus = currentStatus;
    this.requestedStatus = requestedStatus;
    this.allowedTransitions = allowedTransitions;
  }

  toDetails(): Record<string, unknown> {
    return {
      currentStatus: this.currentStatus,
      requestedStatus: this.requestedStatus,
      allowedTransitions: [...this.allowedTransitions],
    };
  }
}
