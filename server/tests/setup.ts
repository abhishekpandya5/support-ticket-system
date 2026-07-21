import { afterAll, beforeAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { loadEnv, resetEnvCache } from '../src/config/env.js';
import { clearDatabase } from './helpers/db.js';

let mongoServer: MongoMemoryServer | undefined;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'support-tickets-test',
    },
  });

  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'error';
  process.env.MONGODB_URI = mongoServer.getUri();

  resetEnvCache();
  loadEnv();
  await connectDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectDatabase();

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = undefined;
  }

  resetEnvCache();
});
