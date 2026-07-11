import type { Types } from 'mongoose';

import {
  User,
  type IUser,
  type UserDocument,
  type UserModel,
} from '../models/User.js';

export type CreateUserInput = Pick<IUser, 'name' | 'email' | 'role'>;

export class UserRepository {
  constructor(private readonly model: UserModel = User) {}

  async findAll(): Promise<UserDocument[]> {
    return this.model.find().sort({ name: 1 }).exec();
  }

  async findById(id: Types.ObjectId | string): Promise<UserDocument | null> {
    return this.model.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async existsById(id: Types.ObjectId | string): Promise<boolean> {
    const count = await this.model
      .countDocuments({ _id: id })
      .limit(1)
      .exec();

    return count > 0;
  }

  async create(data: CreateUserInput): Promise<UserDocument> {
    return this.model.create(data);
  }
}

export const userRepository = new UserRepository();
