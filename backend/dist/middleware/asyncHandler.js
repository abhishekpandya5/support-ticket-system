/**
 * Wraps async route handlers so rejected promises reach the global error middleware.
 */
export function asyncHandler(handler) {
    return (req, res, next) => {
        void handler(req, res, next).catch(next);
    };
}
//# sourceMappingURL=asyncHandler.js.map