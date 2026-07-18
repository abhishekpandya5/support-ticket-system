import { asyncHandler } from '../middleware/asyncHandler.js';
import { ticketService, } from '../services/TicketService.js';
import { serializeComment, serializeTicket, } from '../utils/serializers.js';
function queryParam(value) {
    return typeof value === 'string' ? value : undefined;
}
export class TicketController {
    tickets;
    constructor(tickets = ticketService) {
        this.tickets = tickets;
    }
    list = asyncHandler(async (req, res) => {
        const query = {};
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
    getById = asyncHandler(async (req, res) => {
        const { ticket, comments } = await this.tickets.getTicketById(req.params.id);
        res.status(200).json({
            ticket: serializeTicket(ticket),
            comments: comments.map((comment) => serializeComment(comment)),
        });
    });
    create = asyncHandler(async (req, res) => {
        const body = req.body;
        const input = {
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
    update = asyncHandler(async (req, res) => {
        const body = req.body;
        const input = {};
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
        const ticket = await this.tickets.updateTicket(req.params.id, input);
        res.status(200).json({ ticket: serializeTicket(ticket) });
    });
    changeStatus = asyncHandler(async (req, res) => {
        const body = req.body;
        const ticket = await this.tickets.changeStatus(req.params.id, body.status ?? '');
        res.status(200).json({ ticket: serializeTicket(ticket) });
    });
}
export const ticketController = new TicketController();
//# sourceMappingURL=TicketController.js.map