import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { getUser, updateUser, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/:id', verifyToken, getUser);
userRouter.put('/:id', verifyToken, updateUser);
userRouter.delete('/:id', verifyToken, deleteUser);

export default userRouter;
