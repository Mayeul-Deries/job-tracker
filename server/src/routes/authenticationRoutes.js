import express from 'express';
import { register, login, logout } from '../controllers/authenticationController.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

export default userRouter;
