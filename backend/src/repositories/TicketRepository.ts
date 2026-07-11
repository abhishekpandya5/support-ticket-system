import type { QueryFilter, Types } from 'mongoose';

import {
  Ticket,
  type ITicket,
  type TicketDocument,
  type TicketModel,
} from '../models/Ticket.js';

export type CreateTicketInput = {
  title: string;
  description: string;
  priority: ITicket['priority'];
  status: ITicket['status'];
  createdBy: Types.ObjectId;
  assignedTo: Types.ObjectId | null;
};

export type UpdateTicketFieldsInput = Partial<
  Pick<ITicket, 'title' | 'description' | 'priority' | 'assignedTo'>
>;

const USER_SUMMARY_FIELDS = 'name email';

export class TicketRepository {
  constructor(private readonly model: TicketModel = Ticket) {}

  async findById(
    id: Types.ObjectId | string,
  ): Promise<TicketDocument | null> {
    return this.model.findById(id).exec();
  }

  async findByIdPopulated(
    id: Types.ObjectId | string,
  ): Promise<TicketDocument | null> {
    return this.model
      .findById(id)
      .populate('createdBy', USER_SUMMARY_FIELDS)
      .populate('assignedTo', USER_SUMMARY_FIELDS)
      .exec();
  }

  async findMany(
    filter: QueryFilter<ITicket> = {},
    options: { populate?: boolean } = {},
  ): Promise<TicketDocument[]> {
    let query = this.model.find(filter).sort({ updatedAt: -1 });

    if (options.populate) {
      query = query
        .populate('createdBy', USER_SUMMARY_FIELDS)
        .populate('assignedTo', USER_SUMMARY_FIELDS);
    }

    return query.exec();
  }

  async create(data: CreateTicketInput): Promise<TicketDocument> {
    return this.model.create(data);
  }

  async updateFieldsById(
    id: Types.ObjectId | string,
    fields: UpdateTicketFieldsInput,
  ): Promise<TicketDocument | null> {
    return this.model
      .findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true })
      .exec();
  }

  async updateFieldsByIdPopulated(
    id: Types.ObjectId | string,
    fields: UpdateTicketFieldsInput,
  ): Promise<TicketDocument | null> {
    return this.model
      .findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true })
      .populate('createdBy', USER_SUMMARY_FIELDS)
      .populate('assignedTo', USER_SUMMARY_FIELDS)
      .exec();
  }

  async save(document: TicketDocument): Promise<TicketDocument> {
    return document.save();
  }
}

export const ticketRepository = new TicketRepository();
