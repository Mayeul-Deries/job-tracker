import request from 'supertest';
import app from '../../src/app.js';
import { logout } from '../../src/controllers/authenticationController.js';
import { defaultUser, userRegistration } from '../fixtures/userFixture.js';
import mongoose from 'mongoose';
import { generateToken } from '../../src/utils/generateToken.js';
import User from '../../src/models/userModel.js';
import { describe, expect, it, vi } from 'vitest';

describe('Authentication Controller', () => {
  const invalidUsernames = ['bad username', 'bad@username', 'badusername!', 'bad#username!', 'badUsername'];

  const validUsernames = ['good_username', 'goodusername123', 'good.username', 'good-username'];

  const invalidPasswords = [
    'password', // pas de majuscule, pas de chiffre, pas de spécial
    'PASSWORD', // pas de minuscule, pas de chiffre, pas de spécial
    'Password', // pas de chiffre, pas de spécial
    'Password1', // pas de spécial
    'password1!', // pas de majuscule
    'PASSWORD1!', // pas de minuscule
    'Pass1!', // trop court (<8 caractères)
    '12345678!', // pas de lettre
  ];

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

      it('should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/api/auth/register').send({});

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          error: 'All fields are required',
        });
      });

      it.each(invalidUsernames)('should return 400 for invalid username "%s"', async username => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            ...userRegistration,
            username,
          });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          error:
            'Username can only contain letters, numbers, and underscores, with no spaces, special characters and capital letter',
        });
      });

      it.each(validUsernames)('should accept valid username "%s"', async username => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            ...userRegistration,
            username,
          });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
          message: 'User successfully created',
          user: {
            email: userRegistration.email,
          },
        });
      });

      it.each(invalidPasswords)('should return 400 if password "%s" is invalid', async invalidPassword => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            ...userRegistration,
            password: invalidPassword,
            confirmPassword: invalidPassword,
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
        );
      });

      it('should return 400 if confirm password do not match password', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            ...userRegistration,
            confirmPassword: 'DifferentPassword123*',
          });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          error: 'Passwords do not match',
        });
      });

      it('should return 409 if email already exists', async () => {
        await request(app).post('/api/auth/register').send(userRegistration);

        const res = await request(app)
          .post('/api/auth/register')
          .send({
            ...userRegistration,
            username: 'newusername',
          });

        expect(res.status).toBe(409);
        expect(res.body).toMatchObject({
          error: 'Email already exists',
        });
      });

      it('should return 409 if username already exists', async () => {
        await request(app).post('/api/auth/register').send(userRegistration);

        const res = await request(app)
          .post('/api/auth/register')
          .send({
            ...userRegistration,
            email: 'new.username@examples.com',
          });
        expect(res.status).toBe(409);
        expect(res.body).toMatchObject({
          error: 'Username already exists',
        });
      });

      it('should return 500 if an error occurs', async () => {
        vi.spyOn(User, 'create').mockImplementation(() => {
          throw new Error('Database error');
        });

        const res = await request(app).post('/api/auth/register').send(userRegistration);

        expect(res.status).toBe(500);
        expect(res.body).toMatchObject({
          error: 'Database error',
        });
      });
    });

    describe('login', () => {
      it('should login a user with email', async () => {
        await request(app).post('/api/auth/register').send(userRegistration);
        const res = await request(app).post('/api/auth/login').send({
          loginName: userRegistration.email,
          password: userRegistration.password,
        });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          message: 'User successfully logged in',
          user: {
            email: userRegistration.email,
          },
        });
      });

      it('should login a user with username', async () => {
        await request(app).post('/api/auth/register').send(userRegistration);
        const res = await request(app).post('/api/auth/login').send({
          loginName: userRegistration.username,
          password: userRegistration.password,
        });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          message: 'User successfully logged in',
          user: {
            username: userRegistration.username,
          },
        });
      });

      it('should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/api/auth/login').send({});

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          error: 'All fields are required',
        });
      });

      it('should return 404 if user not found', async () => {
        const res = await request(app).post('/api/auth/login').send({
          loginName: 'non-existent.user@example.com',
          password: 'NonExistentPassword123*',
        });

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
          error: 'User not found',
        });
      });

      it('should return 401 if password is incorrect', async () => {
        await request(app).post('/api/auth/register').send(userRegistration);
        const res = await request(app).post('/api/auth/login').send({
          loginName: userRegistration.email,
          password: 'WrongPassword123*',
        });

        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({
          error: 'Invalid credentials',
        });
      });

      it('should return 500 if an error occurs', async () => {
        vi.spyOn(User, 'findOne').mockImplementation(() => {
          throw new Error('Database error');
        });

        const res = await request(app).post('/api/auth/login').send({
          loginName: userRegistration.email,
          password: userRegistration.password,
        });

        expect(res.status).toBe(500);
        expect(res.body).toMatchObject({
          error: 'Database error',
        });
      });
    });

    describe('logout', () => {
      it('should return a 200 status and clear the token', async () => {
        const user = new User(defaultUser);
        await user.save();
        const response = await request(app)
          .get('/api/auth/logout')
          .set('Authorization', `Bearer ${generateToken(user._id)}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User successfully logged out');
      });
    });

    describe('me', () => {
      it('should return a 200 status and the user connected', async () => {
        const user = new User(defaultUser);
        await user.save();
        const response = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${generateToken(user._id)}`);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe(defaultUser.username);
        expect(response.body.email).toBe(defaultUser.email);
      });

      it('should return a 500 error if user is not connected', async () => {
        vi.spyOn(User, 'findById').mockImplementation(() => {
          throw new Error('User not found');
        });

        const user = new User(defaultUser);
        await user.save();

        const response = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${generateToken(user._id)}`);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal server error');
      });
    });
  });
});
