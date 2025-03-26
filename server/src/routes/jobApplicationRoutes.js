import express from 'express';
import {
  getJobApplications,
  createJobApplication,
  getJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../controllers/jobApplicationController.js';
const jobApplicationRouter = express.Router();

jobApplicationRouter.get('/', getJobApplications);
jobApplicationRouter.post('/', createJobApplication);
jobApplicationRouter.get('/:id', getJobApplication);
jobApplicationRouter.put('/:id', updateJobApplication);
jobApplicationRouter.delete('/:id', deleteJobApplication);

export default jobApplicationRouter;
