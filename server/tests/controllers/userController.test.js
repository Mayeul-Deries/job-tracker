import request from 'supertest';
import app from '../../src/app.js';
import { defaultUser } from '../fixtures/userFixture.js';
import mongoose from 'mongoose';
import { generateToken } from '../../src/utils/generateToken.js';
import User from '../../src/models/userModel.js';

describe('User Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  beforeEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('getUser', () => {
    it('should return 200 and user data when user is found', async () => {
      const user = await User.create(defaultUser);

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'User successfully recovered',
        user: {
          username: user.username,
          email: user.email,
        },
      });
    });

    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/users/${nonExistentUserId}`)
        .set('Cookie', [`__jt_token=${generateToken(nonExistentUserId)}`]);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: 'User not found',
      });
    });

    it('should return 500 if a server error occurs', async () => {
      const userId = new mongoose.Types.ObjectId();

      vi.spyOn(User, 'findOne').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Cookie', [`__jt_token=${generateToken(userId)}`]);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        message: 'Server error',
      });
    });
  });
});
