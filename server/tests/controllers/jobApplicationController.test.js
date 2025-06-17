import request from 'supertest';
import app from '../../src/app.js';
import { defaultUser } from '../fixtures/userFixture.js';
import {
  defaultJobApplication,
  otherJobApplication,
  jobApplicationWithMissingFields,
  otherJobApplication,
} from '../fixtures/jobApplicationFixture.js';
import mongoose from 'mongoose';
import { generateToken } from '../../src/utils/generateToken.js';
import User from '../../src/models/userModel.js';
import JobApplication from '../../src/models/jobApplicationModel.js';
import { describe, expect, it, vi } from 'vitest';

describe('JobApplications Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  beforeEach(async () => {
    vi.restoreAllMocks();

    await User.deleteMany();
    await JobApplication.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('jobApplicationController', () => {
    describe('getJobApplications', () => {
      it('should return 200 and job applications when user has job applications', async () => {
        const user = await User.create(defaultUser);
        const firstJobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });
        const secondJobApplication = await JobApplication.create({
          ...otherJobApplication,
          userId: user._id,
        });

        const res = await request(app)
          .get('/api/jobApplications')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

        expect(res.status).toBe(200);
        expect.arrayContaining([
          expect.objectContaining({
            _id: firstJobApplication._id.toString(),
            company: firstJobApplication.company,
            title: firstJobApplication.title,
            status: firstJobApplication.status,
            category: firstJobApplication.category,
            link: firstJobApplication.link,
            notes: firstJobApplication.notes,
            date: expect.any(Date),
            userId: user._id.toString(),
            city: firstJobApplication.city,
          }),
          expect.objectContaining({
            _id: secondJobApplication._id.toString(),
            company: secondJobApplication.company,
            title: secondJobApplication.title,
            status: secondJobApplication.status,
            category: secondJobApplication.category,
            link: secondJobApplication.link,
            notes: secondJobApplication.notes,
            date: expect.any(Date),
            userId: user._id.toString(),
            city: secondJobApplication.city,
          }),
        ]);
        expect(res.body.jobApplications).toHaveLength(2);
      });

      it('should return a 500 status if an error occurs', async () => {
        const user = await User.create(defaultUser);

        vitest.spyOn(JobApplication, 'find').mockImplementationOnce(() => {
          throw new Error('Test error');
        });

        const res = await request(app)
          .get('/api/jobApplications')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Test error');
      });
    });

    describe('createJobApplication', () => {
      it('should return 201 and create a job application when all required fields are provided', async () => {
        const user = await User.create(defaultUser);

        const res = await request(app)
          .post('/api/jobApplications')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            ...defaultJobApplication,
            userId: user._id,
          });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
          message: 'Job application successfully created',
          jobApplication: {
            ...defaultJobApplication,
            date: expect.any(String),
            userId: user._id.toString(),
            city: defaultJobApplication.city,
          },
        });
      });

      it('should return 400 if required fields are missing', async () => {
        const user = await User.create(defaultUser);

        const res = await request(app)
          .post('/api/jobApplications')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            userId: user._id,
            ...jobApplicationWithMissingFields,
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Missing required fields');
      });

      it('should return 500 if an error occurs', async () => {
        const user = await User.create(defaultUser);
        vi.spyOn(JobApplication, 'create').mockRejectedValue(new Error('Database error'));

        const res = await request(app)
          .post('/api/jobApplications')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            ...defaultJobApplication,
            userId: user._id,
          });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Database error');
      });
    });

    describe('getJobApplication', () => {
      it('should return 200 and the job application if it exists', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        const res = await request(app)
          .get(`/api/jobApplications/${jobApplication._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          message: 'Job application successfully recovered',
          jobApplication: {
            ...defaultJobApplication,
            date: expect.any(String),
            userId: user._id.toString(),
            city: defaultJobApplication.city,
          },
        });
      });

      it('should return 404 if the job application does not exist', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();

        const res = await request(app)
          .get(`/api/jobApplications/${nonExistentUserId}`)
          .set('Cookie', [`__jt_token=${generateToken(nonExistentUserId)}`]);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Job application not found');
      });

      it('should return 500 if an error occurs', async () => {
        const user = await User.create(defaultUser);
        vi.spyOn(JobApplication, 'findOne').mockRejectedValue(new Error('Database error'));

        const res = await request(app)
          .get(`/api/jobApplications/${user._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Database error');
      });
    });

    describe('updateJobApplication', () => {
      it('should return 200 and update the job application if it exists', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        const res = await request(app)
          .put(`/api/jobApplications/${jobApplication._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            ...otherJobApplication,
            userId: user._id,
            city: otherJobApplication.city,
          });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          message: 'Job application successfully updated',
          jobApplication: {
            ...otherJobApplication,
            date: expect.any(String),
            userId: user._id.toString(),
          },
        });
      });

      it('should return 400 if required fields are missing', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        const res = await request(app)
          .put(`/api/jobApplications/${jobApplication._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            userId: user._id,
            ...jobApplicationWithMissingFields,
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Missing required fields');
      });

      it('should return 404 if the job application does not exist', async () => {
        const user = await User.create(defaultUser);
        const nonExistentJobApplicationId = new mongoose.Types.ObjectId();

        const res = await request(app)
          .put(`/api/jobApplications/${nonExistentJobApplicationId}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            ...otherJobApplication,
            userId: user._id,
          });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Job application not found');
      });

      it('should return 500 if an error occurs', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        vi.spyOn(JobApplication, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));

        const res = await request(app)
          .put(`/api/jobApplications/${jobApplication._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            ...otherJobApplication,
            userId: user._id,
          });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Database error');
      });
    });

    describe('patchJobApplication', () => {
      it('should return 200 and update the job application if it exists', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        const res = await request(app)
          .patch(`/api/jobApplications/${jobApplication._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            notes: 'Patched notes',
          });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          message: 'Job application field updated successfully',
          jobApplication: {
            ...defaultJobApplication,
            date: expect.any(String),
            notes: 'Patched notes',
          },
        });
      });

      it('should return 404 if the job application does not exist', async () => {
        const user = await User.create(defaultUser);
        const invalidJobApplicationId = new mongoose.Types.ObjectId();

        const res = await request(app)
          .patch(`/api/jobApplications/${invalidJobApplicationId}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            notes: 'Patched notes',
          });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Job application not found');
      });

      it('should return 500 if an error occurs', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        vi.spyOn(JobApplication, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));

        const res = await request(app)
          .patch(`/api/jobApplications/${jobApplication._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({
            notes: 'Patched notes',
          });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Database error');
      });
    });

    describe('deleteJobApplication', () => {
      it('should return 200 and delete the job application if it exists', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        const res = await request(app)
          .delete(`/api/jobApplications/${jobApplication._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Job application successfully deleted');
      });

      it('should return 404 if the job application does not exist', async () => {
        const user = await User.create(defaultUser);
        const nonExistentJobApplicationId = new mongoose.Types.ObjectId();

        const res = await request(app)
          .delete(`/api/jobApplications/${nonExistentJobApplicationId}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Job application not found');
      });

      it('should return 500 if an error occurs', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        vi.spyOn(JobApplication, 'findOneAndDelete').mockRejectedValue(new Error('Database error'));

        const res = await request(app)
          .delete(`/api/jobApplications/${jobApplication._id}`)
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Database error');
      });
    });

    describe('deleteJobApplicationBatch', () => {
      it('should return 200 and delete job applications specified', async () => {
        const user = await User.create(defaultUser);
        const aJobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });
        const anOtherJobApplication = await JobApplication.create({
          ...otherJobApplication,
          userId: user._id,
        });

        const ids = [aJobApplication._id.toString(), anOtherJobApplication._id.toString()];

        const response = await request(app)
          .delete('/api/jobApplications/batch')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({ ids });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successfully deleted 2 job applications');
      });

      it('should return 400 if ids array is empty', async () => {
        const user = await User.create(defaultUser);

        const response = await request(app)
          .delete('/api/jobApplications/batch')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({ ids: [] });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid ids provided');
      });

      it('should return 400 if ids is not an array', async () => {
        const user = await User.create(defaultUser);

        const response = await request(app)
          .delete('/api/jobApplications/batch')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({ ids: 'not-an-array' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid ids provided');
      });

      it('should return 404 if no job applications are found', async () => {
        const user = await User.create(defaultUser);
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .delete('/api/jobApplications/batch')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({ ids: [nonExistentId] });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('No job applications found');
      });

      it('should return 500 if an error occurs', async () => {
        const user = await User.create(defaultUser);
        const jobApplication = await JobApplication.create({
          ...defaultJobApplication,
          userId: user._id,
        });

        vi.spyOn(JobApplication, 'deleteMany').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
          .delete('/api/jobApplications/batch')
          .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
          .send({ ids: [jobApplication._id] });
        console.log(response);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
      });
    });
  });
});
