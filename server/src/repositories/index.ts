/**
 * Repositories barrel — data access abstraction over Mongoose models.
 */

export {
  CommentRepository,
  commentRepository,
  type CreateCommentInput,
} from './CommentRepository.js';

export {
  TicketRepository,
  ticketRepository,
  type CreateTicketInput,
  type UpdateTicketFieldsInput,
} from './TicketRepository.js';

export {
  UserRepository,
  userRepository,
  type CreateUserInput,
} from './UserRepository.js';
