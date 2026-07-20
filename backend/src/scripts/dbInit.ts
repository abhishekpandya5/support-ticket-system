import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { loadEnv } from '../config/env.js';
import { Comment } from '../models/Comment.js';
import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('db-init');

async function run(): Promise<void> {
  loadEnv();
  await connectDatabase();

  try {
    log.info('Syncing MongoDB indexes');

    const results = await Promise.all([
      User.syncIndexes(),
      Ticket.syncIndexes(),
      Comment.syncIndexes(),
    ]);

    log.info('Index sync complete', {
      users: results[0],
      tickets: results[1],
      comments: results[2],
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown db-init error';

    log.error('Index sync failed', { message });
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

void run();
