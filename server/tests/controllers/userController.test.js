import request from 'supertest';
import app from '../../src/app.js';
import { defaultUser, otherUser } from '../fixtures/userFixture.js';
import mongoose from 'mongoose';
import { generateToken } from '../../src/utils/generateToken.js';
import User from '../../src/models/userModel.js';
import { describe, vi } from 'vitest';

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

  describe('updateUser', () => {
    it('should return 200 and updated user data when user is found', async () => {
      const user = await User.create(defaultUser);
      const updatedData = { username: 'updateduser', email: 'updated@email.com' };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'User successfully updated',
        user: {
          username: updatedData.username,
          email: updatedData.email,
        },
      });
    });

    it('should return an error if the email already exists', async () => {
      const user = await User.create(defaultUser);
      await User.create(otherUser);

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ email: 'jane@example.com' })
        .set('Cookie', `__jt_token=${generateToken(user._id)}`);
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Email already exists');
    });

    it('should return an error if the username already exists', async () => {
      const user = await User.create(defaultUser);
      await User.create(otherUser);

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ username: 'janedoe' })
        .set('Cookie', `__jt_token=${generateToken(user._id)}`);
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Username already exists');
    });

    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/users/${nonExistentUserId}`)
        .set('Cookie', [`__jt_token=${generateToken(nonExistentUserId)}`]);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: 'User not found',
      });
    });

    it('should return 500 if a server error occurs', async () => {
      const userId = new mongoose.Types.ObjectId();

      vi.spyOn(User, 'findOneAndUpdate').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Cookie', [`__jt_token=${generateToken(userId)}`]);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        message: 'Server error',
      });
    });
  });

  describe('deleteUser', () => {
    it('should return 200 and delete the user when user is found', async () => {
      const user = await User.create(defaultUser);

      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'User successfully deleted',
      });
    });

    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/users/${nonExistentUserId}`)
        .set('Cookie', [`__jt_token=${generateToken(nonExistentUserId)}`]);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: 'User not found',
      });
    });

    it('should return 500 if a server error occurs', async () => {
      const userId = new mongoose.Types.ObjectId();

      vi.spyOn(User, 'findOneAndDelete').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Cookie', [`__jt_token=${generateToken(userId)}`]);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        message: 'Server error',
      });
    });
  });
});
