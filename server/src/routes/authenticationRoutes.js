import express from 'express';
import { register, login, logout } from '../controllers/authenticationController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const authenticationRouter = express.Router();

authenticationRouter.post('/register', register);
authenticationRouter.post('/login', login);
authenticationRouter.get('/logout', verifyToken, logout);

export default authenticationRouter;
