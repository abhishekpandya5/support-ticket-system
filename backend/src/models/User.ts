import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import { USER_ROLE_VALUES } from '../constants/enums.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [1, 'Name cannot be empty'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [255, 'Email cannot exceed 255 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: [...USER_ROLE_VALUES],
        message: `Role must be one of: ${USER_ROLE_VALUES.join(', ')}`,
      },
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

userSchema.index({ email: 1 }, { unique: true, name: 'email_1' });

export type IUser = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<IUser>;
export type UserModel = Model<IUser>;

export const User: UserModel =
  (models.User as UserModel | undefined) ?? model<IUser>('User', userSchema);
