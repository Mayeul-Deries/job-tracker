import express from 'express';
import {
  getJobApplications,
  createJobApplication,
  getJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../controllers/jobApplicationController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const jobApplicationRouter = express.Router();

jobApplicationRouter.get('/', verifyToken, getJobApplications);
jobApplicationRouter.post('/', verifyToken, createJobApplication);
jobApplicationRouter.get('/:id', verifyToken, getJobApplication);
jobApplicationRouter.put('/:id', verifyToken, updateJobApplication);
jobApplicationRouter.delete('/:id', verifyToken, deleteJobApplication);

export default jobApplicationRouter;
