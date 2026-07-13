import { Router } from 'express';

import { userController } from '../../../controllers/UserController.js';
import { validateParams } from '../../../middleware/validate.js';
import { idParamSchema } from '../../../validators/shared.js';

export const userRouter = Router();

userRouter.get('/', userController.list);
userRouter.get(
  '/:id',
  validateParams(idParamSchema('user ID')),
  userController.getById,
);
