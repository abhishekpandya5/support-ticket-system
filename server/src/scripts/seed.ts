import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { loadEnv } from '../config/env.js';
import { createLogger } from '../utils/logger.js';
import { seedUsers } from './seedUsers.js';

const log = createLogger('seed');

async function run(): Promise<void> {
  loadEnv();
  await connectDatabase();

  try {
    log.info('Starting user seed');

    const { inserted, skipped } = await seedUsers();

    log.info('User seed complete', {
      insertedCount: inserted.length,
      skippedCount: skipped.length,
      inserted,
      skipped,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown seed error';

    log.error('User seed failed', { message });
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

void run();
