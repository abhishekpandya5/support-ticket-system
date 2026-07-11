import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import {
  TICKET_PRIORITY_VALUES,
  TICKET_STATUS,
  TICKET_STATUS_VALUES,
} from '../constants/enums.js';

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [1, 'Description cannot be empty'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: [...TICKET_PRIORITY_VALUES],
        message: `Priority must be one of: ${TICKET_PRIORITY_VALUES.join(', ')}`,
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: [...TICKET_STATUS_VALUES],
        message: `Status must be one of: ${TICKET_STATUS_VALUES.join(', ')}`,
      },
      default: TICKET_STATUS.OPEN,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
  },
  {
    timestamps: true,
    collection: 'tickets',
  },
);

ticketSchema.index({ status: 1 }, { name: 'status_1' });
ticketSchema.index({ assignedTo: 1 }, { sparse: true, name: 'assignedTo_1' });
ticketSchema.index({ updatedAt: -1 }, { name: 'updatedAt_-1' });

export type ITicket = InferSchemaType<typeof ticketSchema>;
export type TicketDocument = HydratedDocument<ITicket>;
export type TicketModel = Model<ITicket>;

export const Ticket: TicketModel =
  (models.Ticket as TicketModel | undefined) ??
  model<ITicket>('Ticket', ticketSchema);
