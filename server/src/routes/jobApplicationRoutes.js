import express from 'express';
import {
  getJobApplications,
  createJobApplication,
  getJobApplication,
  updateJobApplication,
  patchJobApplication,
  deleteJobApplication,
} from '../controllers/jobApplicationController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const jobApplicationRouter = express.Router();

jobApplicationRouter.get('/', verifyToken, getJobApplications);
jobApplicationRouter.post('/', verifyToken, createJobApplication);
jobApplicationRouter.get('/:id', verifyToken, getJobApplication);
jobApplicationRouter.put('/:id', verifyToken, updateJobApplication);
jobApplicationRouter.patch('/:id', verifyToken, patchJobApplication);
jobApplicationRouter.delete('/:id', verifyToken, deleteJobApplication);

export default jobApplicationRouter;
