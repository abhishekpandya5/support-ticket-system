export declare class InvalidTransitionError extends Error {
    readonly code: "INVALID_STATUS_TRANSITION";
    readonly currentStatus: string;
    readonly requestedStatus: string;
    readonly allowedTransitions: readonly string[];
    constructor(currentStatus: string, requestedStatus: string, allowedTransitions: readonly string[], message?: string);
    toDetails(): Record<string, unknown>;
}
//# sourceMappingURL=InvalidTransitionError.d.ts.map