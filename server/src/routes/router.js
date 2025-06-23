import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './userRoutes.js';
import jobApplicationRouter from './jobApplicationRoutes.js';
import authenticationRouter from './authenticationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use('/api/users', userRouter);
router.use('/api/jobApplications', jobApplicationRouter);
router.use('/api/auth', authenticationRouter);

router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

export default router;
