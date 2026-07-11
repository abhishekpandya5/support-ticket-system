import mongoose, {} from 'mongoose';
import { getEnv, loadEnv } from './env.js';
import { createLogger } from '../utils/logger.js';
const log = createLogger('database');
const READY_STATE_LABELS = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
};
let connectionPromise;
let shutdownHandlersRegistered = false;
let isShuttingDown = false;
function getConnectionOptions() {
    const { NODE_ENV } = getEnv();
    return {
        serverSelectionTimeoutMS: 5_000,
        socketTimeoutMS: 45_000,
        maxPoolSize: NODE_ENV === 'production' ? 10 : 5,
        minPoolSize: NODE_ENV === 'production' ? 1 : 0,
        autoIndex: NODE_ENV !== 'production',
        autoCreate: NODE_ENV !== 'production',
    };
}
function registerConnectionEventListeners() {
    const { connection } = mongoose;
    if (connection.listeners('connected').length > 0) {
        return;
    }
    connection.on('connected', () => {
        log.info('MongoDB connection established', {
            host: connection.host,
            port: connection.port,
            name: connection.name,
        });
    });
    connection.on('reconnected', () => {
        log.info('MongoDB connection re-established');
    });
    connection.on('disconnected', () => {
        log.warn('MongoDB connection lost');
    });
    connection.on('error', (error) => {
        log.error('MongoDB connection error', {
            name: error.name,
            message: error.message,
        });
    });
}
/**
 * Establishes a Mongoose connection to MongoDB.
 * Idempotent — subsequent calls return the same in-flight or resolved promise.
 */
export async function connectDatabase() {
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }
    if (connectionPromise) {
        return connectionPromise;
    }
    loadEnv();
    registerConnectionEventListeners();
    const { MONGODB_URI, NODE_ENV } = getEnv();
    const options = getConnectionOptions();
    log.info('Connecting to MongoDB', {
        environment: NODE_ENV,
        maxPoolSize: options.maxPoolSize,
    });
    connectionPromise = mongoose
        .connect(MONGODB_URI, options)
        .then((instance) => {
        log.info('MongoDB connect() resolved');
        return instance;
    })
        .catch((error) => {
        connectionPromise = undefined;
        const message = error instanceof Error ? error.message : 'Unknown connection error';
        log.error('Failed to connect to MongoDB', { message });
        throw error;
    });
    return connectionPromise;
}
/**
 * Closes the Mongoose connection gracefully.
 * Safe to call multiple times.
 */
export async function disconnectDatabase() {
    if (mongoose.connection.readyState === 0) {
        log.debug('MongoDB already disconnected');
        connectionPromise = undefined;
        return;
    }
    log.info('Disconnecting from MongoDB');
    try {
        await mongoose.disconnect();
        log.info('MongoDB disconnected successfully');
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown disconnection error';
        log.error('Error while disconnecting from MongoDB', { message });
        throw error;
    }
    finally {
        connectionPromise = undefined;
    }
}
/**
 * Registers process signal handlers for graceful database shutdown.
 * Call once during application bootstrap.
 */
export function registerDatabaseShutdownHandlers() {
    if (shutdownHandlersRegistered) {
        return;
    }
    const shutdown = async (signal) => {
        if (isShuttingDown) {
            return;
        }
        isShuttingDown = true;
        log.info('Received shutdown signal', { signal });
        try {
            await disconnectDatabase();
            process.exit(0);
        }
        catch {
            process.exit(1);
        }
    };
    process.once('SIGINT', () => {
        void shutdown('SIGINT');
    });
    process.once('SIGTERM', () => {
        void shutdown('SIGTERM');
    });
    shutdownHandlersRegistered = true;
    log.debug('Database shutdown handlers registered');
}
/** Returns true when Mongoose is connected (readyState === 1). */
export function isDatabaseConnected() {
    return mongoose.connection.readyState === 1;
}
/** Human-readable Mongoose connection state. */
export function getDatabaseConnectionState() {
    return (READY_STATE_LABELS[mongoose.connection.readyState] ?? 'unknown');
}
//# sourceMappingURL=database.js.map