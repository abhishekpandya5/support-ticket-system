import type { Request, Response } from 'express';

import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  ticketService,
  type CreateTicketInput,
  type ListTicketsQuery,
  type TicketService,
  type UpdateTicketInput,
} from '../services/TicketService.js';
import {
  serializeComment,
  serializeTicket,
} from '../utils/serializers.js';

function queryParam(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export class TicketController {
  constructor(private readonly tickets: TicketService = ticketService) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const query: ListTicketsQuery = {};

    const search = queryParam(req.query.search);
    const status = queryParam(req.query.status);

    if (search !== undefined) {
      query.search = search;
    }

    if (status !== undefined) {
      query.status = status;
    }

    const tickets = await this.tickets.listTickets(query);

    res.status(200).json({
      tickets: tickets.map((ticket) => serializeTicket(ticket)),
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { ticket, comments } = await this.tickets.getTicketById(
      req.params.id as string,
    );

    res.status(200).json({
      ticket: serializeTicket(ticket),
      comments: comments.map((comment) => serializeComment(comment)),
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CreateTicketInput;

    const input: CreateTicketInput = {
      title: body.title,
      description: body.description,
      priority: body.priority,
      createdBy: body.createdBy,
    };

    if (body.assignedTo !== undefined) {
      input.assignedTo = body.assignedTo;
    }

    const ticket = await this.tickets.createTicket(input);

    res.status(201).json({ ticket: serializeTicket(ticket) });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as UpdateTicketInput;
    const input: UpdateTicketInput = {};

    if (body.title !== undefined) {
      input.title = body.title;
    }

    if (body.description !== undefined) {
      input.description = body.description;
    }

    if (body.priority !== undefined) {
      input.priority = body.priority;
    }

    if (body.assignedTo !== undefined) {
      input.assignedTo = body.assignedTo;
    }

    if (body.status !== undefined) {
      input.status = body.status;
    }

    const ticket = await this.tickets.updateTicket(req.params.id as string, input);

    res.status(200).json({ ticket: serializeTicket(ticket) });
  });

  changeStatus = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as { status?: string };

    const ticket = await this.tickets.changeStatus(
      req.params.id as string,
      body.status ?? '',
    );

    res.status(200).json({ ticket: serializeTicket(ticket) });
  });
}

export const ticketController = new TicketController();
