import express from 'express';
import { register, login, logout } from '../controllers/authenticationController.js';

const authenticationRouter = express.Router();

authenticationRouter.post('/register', register);
authenticationRouter.post('/login', login);
authenticationRouter.get('/logout', logout);

export default authenticationRouter;
