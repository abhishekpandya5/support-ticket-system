export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: 'VALIDATION_ERROR';
    readonly INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION';
    readonly STATUS_UPDATE_NOT_ALLOWED: 'STATUS_UPDATE_NOT_ALLOWED';
    readonly INVALID_OBJECT_ID: 'INVALID_OBJECT_ID';
    readonly NOT_FOUND: 'NOT_FOUND';
    readonly INTERNAL_ERROR: 'INTERNAL_ERROR';
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
//# sourceMappingURL=errorCodes.d.ts.map