import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';
import { ERROR_CODES } from '../../src/constants/errorCodes.js';
import { TICKET_STATUS } from '../../src/constants/enums.js';
import { createTicket, seedUsers } from '../helpers/fixtures.js';

const NON_EXISTENT_OBJECT_ID = '507f1f77bcf86cd799439011';
const INVALID_OBJECT_ID = 'not-a-valid-object-id';

describe('Tickets API integration', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /api/tickets — ticket creation', () => {
    it('creates a ticket with valid payload', async () => {
      const { agent } = await seedUsers();

      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Printer not working',
          description: 'Office printer on floor 2 is offline',
          priority: 'high',
          createdBy: agent.id,
        })
        .expect(201);

      expect(response.body.ticket).toMatchObject({
        title: 'Printer not working',
        description: 'Office printer on floor 2 is offline',
        priority: 'high',
        status: TICKET_STATUS.OPEN,
        assignedTo: null,
      });
      expect(response.body.ticket.createdBy.id).toBe(agent.id);
      expect(response.body.ticket.id).toMatch(/^[a-f0-9]{24}$/);
    });

    it('returns 400 when required fields are missing', async () => {
      const { agent } = await seedUsers();

      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: '',
          description: '',
          priority: 'high',
          createdBy: agent.id,
        })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(response.body.error.details.fields).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
      });
    });
  });

  describe('PATCH /api/tickets/:id — ticket update', () => {
    it('updates mutable ticket fields', async () => {
      const { agent, admin } = await seedUsers();
      const ticket = await createTicket({
        title: 'Original title',
        description: 'Original description',
        createdBy: agent.id,
        priority: 'low',
      });

      const response = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .send({
          title: 'Updated title',
          priority: 'critical',
          assignedTo: admin.id,
        })
        .expect(200);

      expect(response.body.ticket).toMatchObject({
        id: ticket.id,
        title: 'Updated title',
        priority: 'critical',
        status: TICKET_STATUS.OPEN,
      });
      expect(response.body.ticket.assignedTo.id).toBe(admin.id);
    });

    it('rejects status changes on the field update endpoint', async () => {
      const { agent } = await seedUsers();
      const ticket = await createTicket({
        title: 'Status bypass attempt',
        description: 'Should not allow direct status update',
        createdBy: agent.id,
      });

      const response = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .send({ status: TICKET_STATUS.IN_PROGRESS })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.STATUS_UPDATE_NOT_ALLOWED);
    });

    it('returns 400 when update body is empty', async () => {
      const { agent } = await seedUsers();
      const ticket = await createTicket({
        title: 'No-op update',
        description: 'Testing empty patch body',
        createdBy: agent.id,
      });

      const response = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    });
  });

  describe('PATCH /api/tickets/:id/status — state transitions', () => {
    it('allows valid status transitions along the lifecycle', async () => {
      const { agent } = await seedUsers();

      const createResponse = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Lifecycle ticket',
          description: 'Exercise valid transitions',
          priority: 'medium',
          createdBy: agent.id,
        })
        .expect(201);

      const ticketId = createResponse.body.ticket.id as string;

      const inProgress = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: TICKET_STATUS.IN_PROGRESS })
        .expect(200);
      expect(inProgress.body.ticket.status).toBe(TICKET_STATUS.IN_PROGRESS);

      const resolved = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: TICKET_STATUS.RESOLVED })
        .expect(200);
      expect(resolved.body.ticket.status).toBe(TICKET_STATUS.RESOLVED);

      const closed = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: TICKET_STATUS.CLOSED })
        .expect(200);
      expect(closed.body.ticket.status).toBe(TICKET_STATUS.CLOSED);
    });

    it('allows cancelling from open', async () => {
      const { agent } = await seedUsers();
      const ticket = await createTicket({
        title: 'Cancel me',
        description: 'Open to cancelled',
        createdBy: agent.id,
      });

      const response = await request(app)
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: TICKET_STATUS.CANCELLED })
        .expect(200);

      expect(response.body.ticket.status).toBe(TICKET_STATUS.CANCELLED);
    });

    it('rejects invalid status transitions', async () => {
      const { agent } = await seedUsers();
      const ticket = await createTicket({
        title: 'Invalid jump',
        description: 'Open cannot go directly to resolved',
        createdBy: agent.id,
      });

      const response = await request(app)
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: TICKET_STATUS.RESOLVED })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.INVALID_STATUS_TRANSITION);
      expect(response.body.error.details).toMatchObject({
        currentStatus: TICKET_STATUS.OPEN,
        requestedStatus: TICKET_STATUS.RESOLVED,
        allowedTransitions: expect.arrayContaining([
          TICKET_STATUS.IN_PROGRESS,
          TICKET_STATUS.CANCELLED,
        ]),
      });
    });

    it('rejects transitions from terminal states', async () => {
      const { agent } = await seedUsers();
      const ticket = await createTicket({
        title: 'Closed ticket',
        description: 'No further transitions',
        createdBy: agent.id,
        status: TICKET_STATUS.CLOSED,
      });

      const response = await request(app)
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: TICKET_STATUS.OPEN })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.INVALID_STATUS_TRANSITION);
      expect(response.body.error.details.allowedTransitions).toEqual([]);
    });
  });

  describe('POST /api/tickets/:id/comments — add comments', () => {
    it('adds a comment to an existing ticket', async () => {
      const { agent } = await seedUsers();
      const ticket = await createTicket({
        title: 'Comment target',
        description: 'Ticket receives a comment',
        createdBy: agent.id,
      });

      const response = await request(app)
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({
          message: 'Investigating the issue now',
          createdBy: agent.id,
        })
        .expect(201);

      expect(response.body.comment).toMatchObject({
        ticketId: ticket.id,
        message: 'Investigating the issue now',
      });
      expect(response.body.comment.createdBy.id).toBe(agent.id);

      const detail = await request(app)
        .get(`/api/tickets/${ticket.id}`)
        .expect(200);

      expect(detail.body.comments).toHaveLength(1);
      expect(detail.body.comments[0].message).toBe('Investigating the issue now');
    });

    it('returns 404 when commenting on a missing ticket', async () => {
      const { agent } = await seedUsers();

      const response = await request(app)
        .post(`/api/tickets/${NON_EXISTENT_OBJECT_ID}/comments`)
        .send({
          message: 'Orphan comment',
          createdBy: agent.id,
        })
        .expect(404);

      expect(response.body.error.code).toBe(ERROR_CODES.NOT_FOUND);
    });
  });

  describe('GET /api/tickets — search and status filter', () => {
    it('searches tickets by title and description (case-insensitive)', async () => {
      const { agent } = await seedUsers();

      await createTicket({
        title: 'VPN Connection Issue',
        description: 'User cannot connect remotely',
        createdBy: agent.id,
      });
      await createTicket({
        title: 'Hardware request',
        description: 'Need a new laptop',
        createdBy: agent.id,
      });
      await createTicket({
        title: 'Email outage',
        description: 'VPN logs show authentication failures',
        createdBy: agent.id,
      });

      const response = await request(app)
        .get('/api/tickets')
        .query({ search: 'vpn' })
        .expect(200);

      const titles = response.body.tickets.map(
        (ticket: { title: string }) => ticket.title,
      );

      expect(titles).toEqual(
        expect.arrayContaining(['VPN Connection Issue', 'Email outage']),
      );
      expect(titles).not.toContain('Hardware request');
    });

    it('filters tickets by status', async () => {
      const { agent } = await seedUsers();

      await createTicket({
        title: 'Open ticket',
        description: 'Still open',
        createdBy: agent.id,
        status: TICKET_STATUS.OPEN,
      });
      await createTicket({
        title: 'Closed ticket',
        description: 'Already closed',
        createdBy: agent.id,
        status: TICKET_STATUS.CLOSED,
      });
      await createTicket({
        title: 'Another open ticket',
        description: 'Also open',
        createdBy: agent.id,
        status: TICKET_STATUS.OPEN,
      });

      const response = await request(app)
        .get('/api/tickets')
        .query({ status: TICKET_STATUS.OPEN })
        .expect(200);

      expect(response.body.tickets).toHaveLength(2);
      expect(
        response.body.tickets.every(
          (ticket: { status: string }) => ticket.status === TICKET_STATUS.OPEN,
        ),
      ).toBe(true);
    });
  });

  describe('validation failures', () => {
    it('rejects invalid priority on create', async () => {
      const { agent } = await seedUsers();

      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Bad priority',
          description: 'Priority enum validation',
          priority: 'urgent',
          createdBy: agent.id,
        })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(response.body.error.details.fields.priority).toBeDefined();
    });

    it('rejects invalid createdBy on create', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Bad author',
          description: 'Invalid user reference',
          priority: 'low',
          createdBy: INVALID_OBJECT_ID,
        })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.INVALID_OBJECT_ID);
    });

    it('rejects invalid status filter query values', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .query({ status: 'not-a-status' })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(response.body.error.details.fields.status).toBeDefined();
    });

    it('rejects comments with an empty message', async () => {
      const { agent } = await seedUsers();
      const ticket = await createTicket({
        title: 'Comment validation',
        description: 'Empty comment should fail',
        createdBy: agent.id,
      });

      const response = await request(app)
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({
          message: '   ',
          createdBy: agent.id,
        })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(response.body.error.details.fields.message).toBeDefined();
    });
  });

  describe('invalid IDs', () => {
    it('returns 400 for malformed ticket id on GET', async () => {
      const response = await request(app)
        .get(`/api/tickets/${INVALID_OBJECT_ID}`)
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.INVALID_OBJECT_ID);
    });

    it('returns 404 for well-formed but missing ticket id on GET', async () => {
      const response = await request(app)
        .get(`/api/tickets/${NON_EXISTENT_OBJECT_ID}`)
        .expect(404);

      expect(response.body.error.code).toBe(ERROR_CODES.NOT_FOUND);
    });

    it('returns 400 for malformed ticket id on status change', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${INVALID_OBJECT_ID}/status`)
        .send({ status: TICKET_STATUS.IN_PROGRESS })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.INVALID_OBJECT_ID);
    });

    it('returns 400 for malformed ticket id on comment create', async () => {
      const { agent } = await seedUsers();

      const response = await request(app)
        .post(`/api/tickets/${INVALID_OBJECT_ID}/comments`)
        .send({
          message: 'Should not persist',
          createdBy: agent.id,
        })
        .expect(400);

      expect(response.body.error.code).toBe(ERROR_CODES.INVALID_OBJECT_ID);
    });
  });
});
