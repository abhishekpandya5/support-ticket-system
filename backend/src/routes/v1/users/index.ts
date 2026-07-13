import { Router } from 'express';

import { userController } from '../../../controllers/UserController.js';

export const userRouter = Router();

userRouter.get('/', userController.list);
userRouter.get('/:id', userController.getById);
