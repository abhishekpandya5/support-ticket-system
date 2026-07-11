import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    MONGODB_URI: z.ZodString;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        debug: "debug";
        error: "error";
        info: "info";
        warn: "warn";
    }>>;
    CORS_ORIGINS: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string[] | undefined, string | undefined>>;
}, z.core.$strip>;
export type Env = z.infer<typeof envSchema>;
/**
 * Loads and validates environment variables from process.env (and .env file).
 * Safe to call multiple times — result is cached after first successful parse.
 */
export declare function loadEnv(): Env;
/**
 * Returns validated environment variables.
 * @throws If {@link loadEnv} has not been called successfully.
 */
export declare function getEnv(): Env;
/**
 * Clears cached environment — intended for tests only.
 */
export declare function resetEnvCache(): void;
export {};
//# sourceMappingURL=env.d.ts.map