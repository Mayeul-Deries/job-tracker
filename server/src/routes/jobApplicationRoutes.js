import express from 'express';
import {
  getJobApplications,
  createJobApplication,
  getJobApplication,
  updateJobApplication,
  patchJobApplication,
  deleteJobApplicationBatch,
  deleteJobApplication,
  getJobApplicationStats,
} from '../controllers/jobApplicationController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const jobApplicationRouter = express.Router();

jobApplicationRouter.get('/stats', verifyToken, getJobApplicationStats);
jobApplicationRouter.get('/', verifyToken, getJobApplications);
jobApplicationRouter.post('/', verifyToken, createJobApplication);
jobApplicationRouter.get('/:id', verifyToken, getJobApplication);
jobApplicationRouter.put('/:id', verifyToken, updateJobApplication);
jobApplicationRouter.patch('/:id', verifyToken, patchJobApplication);
jobApplicationRouter.delete('/batch', verifyToken, deleteJobApplicationBatch);
jobApplicationRouter.delete('/:id', verifyToken, deleteJobApplication);

export default jobApplicationRouter;
