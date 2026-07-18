import { ERROR_CODES } from '../constants/errorCodes.js';
export function notFoundHandler(req, res) {
    res.status(404).json({
        requestId: req.requestId,
        error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Route not found',
        },
    });
}
//# sourceMappingURL=notFoundHandler.js.map