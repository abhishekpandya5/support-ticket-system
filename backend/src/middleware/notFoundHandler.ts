import type { Request, Response } from 'express';

import { ERROR_CODES } from '../constants/errorCodes.js';

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: 'Route not found',
    },
  });
}
