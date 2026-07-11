import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

const commentSchema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Ticket ID is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [1, 'Message cannot be empty'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
  },
  {
    timestamps: true,
    collection: 'comments',
  },
);

commentSchema.index(
  { ticketId: 1, createdAt: 1 },
  { name: 'ticketId_1_createdAt_1' },
);

export type IComment = InferSchemaType<typeof commentSchema>;
export type CommentDocument = HydratedDocument<IComment>;
export type CommentModel = Model<IComment>;

export const Comment: CommentModel =
  (models.Comment as CommentModel | undefined) ??
  model<IComment>('Comment', commentSchema);
