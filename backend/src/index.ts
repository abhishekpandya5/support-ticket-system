import type { Server } from 'node:http';

import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { getEnv, loadEnv } from './config/env.js';
import { createLogger } from './utils/logger.js';

const log = createLogger('server');

let server: Server | undefined;
let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  log.info('Shutting down', { signal });

  const closeServer = new Promise<void>((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      log.info('HTTP server closed');
      resolve();
    });
  });

  try {
    await closeServer;
    await disconnectDatabase();
    process.exit(0);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown shutdown error';
    log.error('Shutdown failed', { message });
    process.exit(1);
  }
}

function registerShutdownHandlers(): void {
  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

async function bootstrap(): Promise<void> {
  try {
    loadEnv();
    registerShutdownHandlers();

    await connectDatabase();

    const env = getEnv();
    const app = createApp();

    server = app.listen(env.PORT, () => {
      log.info('Server started', {
        port: env.PORT,
        environment: env.NODE_ENV,
      });
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown startup error';

    log.error('Failed to start server', { message });
    process.exit(1);
  }
}

void bootstrap();
