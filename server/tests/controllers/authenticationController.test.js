import request from 'supertest';
import app from '../../src/app.js';
import { defaultUser, userRegistration } from '../fixtures/userFixture.js';
import mongoose from 'mongoose';
import { generateToken } from '../../src/utils/generateToken.js';
import User from '../../src/models/userModel.js';
import { describe, expect, it, vi } from 'vitest';

describe('JobApplications Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  beforeEach(async () => {
    vi.restoreAllMocks();

    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('authenticationController', () => {
    describe('register', () => {
      it('should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send(userRegistration);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
          message: 'User successfully created',
          user: {
            username: userRegistration.username,
            email: userRegistration.email,
          },
        });
      });
    });
  });
});
