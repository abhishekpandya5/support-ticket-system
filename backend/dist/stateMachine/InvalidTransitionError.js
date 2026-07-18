import { ERROR_CODES } from '../constants/errorCodes.js';
export class InvalidTransitionError extends Error {
    code = ERROR_CODES.INVALID_STATUS_TRANSITION;
    currentStatus;
    requestedStatus;
    allowedTransitions;
    constructor(currentStatus, requestedStatus, allowedTransitions, message) {
        super(message ??
            `Cannot transition from '${currentStatus}' to '${requestedStatus}'.`);
        this.name = 'InvalidTransitionError';
        this.currentStatus = currentStatus;
        this.requestedStatus = requestedStatus;
        this.allowedTransitions = allowedTransitions;
    }
    toDetails() {
        return {
            currentStatus: this.currentStatus,
            requestedStatus: this.requestedStatus,
            allowedTransitions: [...this.allowedTransitions],
        };
    }
}
//# sourceMappingURL=InvalidTransitionError.js.map