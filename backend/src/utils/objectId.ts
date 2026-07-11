import { Types } from 'mongoose';

/**
 * Strict ObjectId validation (24-char hex).
 */
export function isValidObjectId(value: string): boolean {
  if (!Types.ObjectId.isValid(value)) {
    return false;
  }

  return String(new Types.ObjectId(value)) === value;
}

export function toObjectId(value: string): Types.ObjectId {
  return new Types.ObjectId(value);
}
