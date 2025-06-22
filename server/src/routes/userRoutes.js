import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { getUser, updateUser, updateAvatar, deleteUser } from '../controllers/userController.js';
import { uploadAvatar } from '../configs/uploadConfig.js';

const userRouter = express.Router();

userRouter.get('/:id', verifyToken, getUser);
userRouter.put('/:id', verifyToken, updateUser);
userRouter.put('/:id/avatar', uploadAvatar.single('avatar'), updateAvatar);
userRouter.delete('/:id', verifyToken, deleteUser);

export default userRouter;
