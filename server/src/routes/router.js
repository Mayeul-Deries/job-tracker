import express from 'express';
import userRouter from './userRoutes.js';
import jobApplicationRouter from './jobApplicationRoutes.js';
import authenticationRouter from './authenticationRoutes.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/jobApplications', jobApplicationRouter);
router.use('/auth', authenticationRouter);

export default router;
