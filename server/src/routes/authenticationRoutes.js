import express from 'express';
import { register, login, logout, getConnectedUser, forgotPassword } from '../controllers/authenticationController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const authenticationRouter = express.Router();

authenticationRouter.post('/register', register);
authenticationRouter.post('/login', login);
authenticationRouter.get('/logout', verifyToken, logout);
authenticationRouter.get('/me', verifyToken, getConnectedUser);
authenticationRouter.post('/forgot-password', forgotPassword);

export default authenticationRouter;
