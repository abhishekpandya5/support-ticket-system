import type { Request, Response } from 'express';

import { ERROR_CODES } from '../constants/errorCodes.js';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    requestId: req.requestId,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: 'Route not found',
    },
  });
}
