import request from 'supertest';
import app from '../../src/app.js';
import { defaultUser } from '../fixtures/userFixture.js';
import { defaultJobApplication, otherJobApplication } from '../fixtures/jobApplicationFixture.js';
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
    await User.deleteMany();
    await JobApplication.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

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

      const response = await request(app)
        .get('/api/jobApplications')
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

      expect(response.status).toBe(200);
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
        }),
      ]);
      expect(response.body.jobApplications).toHaveLength(2);
    });
  });
});
