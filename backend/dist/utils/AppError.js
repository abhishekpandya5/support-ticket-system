export class AppError extends Error {
    code;
    statusCode;
    details;
    constructor(code, statusCode, message, details) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        if (details !== undefined) {
            this.details = details;
        }
    }
}
//# sourceMappingURL=AppError.js.map