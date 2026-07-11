import type { Types } from 'mongoose';

import {
  userRepository,
  type UserRepository,
} from '../repositories/UserRepository.js';
import type { UserDocument } from '../models/User.js';
import { invalidObjectIdError, notFoundError } from '../utils/errors.js';
import { isValidObjectId } from '../utils/objectId.js';

export class UserService {
  constructor(private readonly users: UserRepository = userRepository) {}

  async listUsers(): Promise<UserDocument[]> {
    return this.users.findAll();
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    this.assertValidObjectId(id, 'user ID');
    return this.users.findById(id);
  }

  async assertUserExists(id: Types.ObjectId | string): Promise<UserDocument> {
    const normalizedId = typeof id === 'string' ? id : id.toString();
    this.assertValidObjectId(normalizedId, 'user ID');

    const user = await this.users.findById(normalizedId);

    if (!user) {
      throw notFoundError('User');
    }

    return user;
  }

  private assertValidObjectId(value: string, fieldLabel: string): void {
    if (!isValidObjectId(value)) {
      throw invalidObjectIdError(fieldLabel);
    }
  }
}

export const userService = new UserService();
