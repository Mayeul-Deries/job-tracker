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
    vi.restoreAllMocks();

    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('getUser', () => {
    it('should return 200 and user data when user is found', async () => {
      const user = await User.create(defaultUser);

      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User successfully recovered',
        user: {
          username: user.username,
          email: user.email,
        },
      });
    });

    it('should return 400 if user ID is invalid', async () => {
      const invalidId = 'invalid-id-format';

      const res = await request(app)
        .get(`/api/users/${invalidId}`)
        .set('Cookie', [`__jt_token=${generateToken(invalidId)}`]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: 'Invalid ID',
      });
    });

    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/users/${nonExistentUserId}`)
        .set('Cookie', [`__jt_token=${generateToken(nonExistentUserId)}`]);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        error: 'User not found',
      });
    });

    it('should return 500 if a server error occurs', async () => {
      const userId = new mongoose.Types.ObjectId();

      vi.spyOn(User, 'findOne').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set('Cookie', [`__jt_token=${generateToken(userId)}`]);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        error: 'Server error',
      });
    });
  });

  describe('updateUser', () => {
    it('should return 200 and updated user data when user is found', async () => {
      const user = await User.create(defaultUser);
      const updatedData = { username: 'updateduser', email: 'updated@email.com' };

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User successfully updated',
        user: {
          username: updatedData.username,
          email: updatedData.email,
        },
      });
    });

    it('should return 400 if user ID is invalid', async () => {
      const invalidId = 'invalid-id-format';

      const res = await request(app)
        .put(`/api/users/${invalidId}`)
        .set('Cookie', [`__jt_token=${generateToken(invalidId)}`])
        .send({ username: 'newusername' });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: 'Invalid ID',
      });
    });

    it('should return a 409 if the email already exists', async () => {
      const user = await User.create(defaultUser);
      await User.create(otherUser);

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ email: 'jane@example.com' })
        .set('Cookie', `__jt_token=${generateToken(user._id)}`);
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Email already exists');
    });

    it('should return a 409 if the username already exists', async () => {
      const user = await User.create(defaultUser);
      await User.create(otherUser);

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ username: 'janedoe' })
        .set('Cookie', `__jt_token=${generateToken(user._id)}`);
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Username already exists');
    });

    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/users/${nonExistentUserId}`)
        .send({ username: 'johndoe' })
        .set('Cookie', [`__jt_token=${generateToken(nonExistentUserId)}`]);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        error: 'User not found',
      });
    });

    it('should return 400 when username format is invalid', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
        .send({ username: 'Invalid Username!' });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: 'Username can only contain letters, numbers, and underscores, with no spaces or special characters',
      });
    });

    it('should return 400 when email format is invalid', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
        .send({ email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: 'Invalid email',
      });
    });

    it('should return 400 when no fields are provided', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`])
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: 'At least one field must be provided',
      });
    });

    it('should return 500 if a server error occurs', async () => {
      const userId = new mongoose.Types.ObjectId();

      vi.spyOn(User, 'findOneAndUpdate').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({ username: 'johndoe' })
        .set('Cookie', [`__jt_token=${generateToken(userId)}`]);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        error: 'Server error',
      });
    });
  });

  describe('deleteUser', () => {
    it('should return 200 and delete the user when user is found', async () => {
      const user = await User.create(defaultUser);

      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Cookie', [`__jt_token=${generateToken(user._id)}`]);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User successfully deleted',
      });
    });

    it('should return 400 if user ID is invalid', async () => {
      const invalidId = 'invalid-id-format';

      const res = await request(app)
        .delete(`/api/users/${invalidId}`)
        .set('Cookie', [`__jt_token=${generateToken(invalidId)}`]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: 'Invalid ID',
      });
    });
    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/users/${nonExistentUserId}`)
        .set('Cookie', [`__jt_token=${generateToken(nonExistentUserId)}`]);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        error: 'User not found',
      });
    });

    it('should return 500 if a server error occurs', async () => {
      const userId = new mongoose.Types.ObjectId();

      vi.spyOn(User, 'findOneAndDelete').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Cookie', [`__jt_token=${generateToken(userId)}`]);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        error: 'Server error',
      });
    });
  });
});
