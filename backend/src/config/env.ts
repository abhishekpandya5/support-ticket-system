import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required')
    .refine(
      (value) =>
        value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
      'MONGODB_URI must be a valid MongoDB connection string',
    ),
  PORT: z.coerce.number().int().positive().default(3001),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      const origins = value
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);

      return origins.length > 0 ? origins : undefined;
    }),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

function formatValidationErrors(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('; ');
}

/**
 * Loads and validates environment variables from process.env (and .env file).
 * Safe to call multiple times — result is cached after first successful parse.
 */
export function loadEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  loadDotenv();

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${formatValidationErrors(result.error)}`,
    );
  }

  cachedEnv = result.data;
  return cachedEnv;
}

/**
 * Returns validated environment variables.
 * @throws If {@link loadEnv} has not been called successfully.
 */
export function getEnv(): Env {
  if (!cachedEnv) {
    throw new Error(
      'Environment not loaded. Call loadEnv() before accessing configuration.',
    );
  }

  return cachedEnv;
}

/**
 * Clears cached environment — intended for tests only.
 */
export function resetEnvCache(): void {
  cachedEnv = undefined;
}
