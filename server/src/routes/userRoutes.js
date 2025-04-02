import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/:id', getUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
