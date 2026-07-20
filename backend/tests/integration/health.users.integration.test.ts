import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';
import { seedUsers } from '../helpers/fixtures.js';

const NON_EXISTENT_OBJECT_ID = '507f1f77bcf86cd799439011';
const INVALID_OBJECT_ID = 'not-a-valid-object-id';

describe('Health and Users API integration', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /health', () => {
    it('returns ok when the database is connected', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toMatchObject({
        status: 'ok',
        checks: {
          database: expect.any(String),
        },
      });
      expect(response.body.timestamp).toBeTruthy();
    });
  });

  describe('GET /api/users', () => {
    it('returns seeded users', async () => {
      await seedUsers();

      const response = await request(app).get('/api/users').expect(200);

      expect(response.body.users.length).toBeGreaterThanOrEqual(3);
      expect(response.body.users[0]).toMatchObject({
        id: expect.stringMatching(/^[a-f0-9]{24}$/),
        name: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('returns a user by id', async () => {
      const { agent } = await seedUsers();

      const response = await request(app)
        .get(`/api/users/${agent.id}`)
        .expect(200);

      expect(response.body.user).toMatchObject({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
      });
    });

    it('returns 404 for a missing user', async () => {
      const response = await request(app)
        .get(`/api/users/${NON_EXISTENT_OBJECT_ID}`)
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('returns 400 for a malformed user id', async () => {
      const response = await request(app)
        .get(`/api/users/${INVALID_OBJECT_ID}`)
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_OBJECT_ID');
    });
  });
});
