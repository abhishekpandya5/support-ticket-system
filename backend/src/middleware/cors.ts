import cors from 'cors';

import { getEnv } from '../config/env.js';

const DEFAULT_DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
];

/**
 * Returns CORS middleware configured from environment.
 * Development defaults to common frontend dev-server origins.
 */
export function configureCors() {
  const { NODE_ENV, CORS_ORIGINS } = getEnv();
  const allowedOrigins =
    CORS_ORIGINS ?? (NODE_ENV === 'production' ? [] : DEFAULT_DEV_ORIGINS);

  return cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
}
