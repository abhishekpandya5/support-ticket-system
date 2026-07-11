import mongoose from 'mongoose';
/**
 * Establishes a Mongoose connection to MongoDB.
 * Idempotent — subsequent calls return the same in-flight or resolved promise.
 */
export declare function connectDatabase(): Promise<typeof mongoose>;
/**
 * Closes the Mongoose connection gracefully.
 * Safe to call multiple times.
 */
export declare function disconnectDatabase(): Promise<void>;
/**
 * Registers process signal handlers for graceful database shutdown.
 * Call once during application bootstrap.
 */
export declare function registerDatabaseShutdownHandlers(): void;
/** Returns true when Mongoose is connected (readyState === 1). */
export declare function isDatabaseConnected(): boolean;
/** Human-readable Mongoose connection state. */
export declare function getDatabaseConnectionState(): string;
//# sourceMappingURL=database.d.ts.map