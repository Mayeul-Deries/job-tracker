import request from 'supertest';
import app from '../../src/app.js';
import { defaultUser, userRegistration } from '../fixtures/userFixture.js';
import mongoose from 'mongoose';
import { generateToken } from '../../src/utils/generateToken.js';
import User from '../../src/models/userModel.js';
import { describe, expect, it, vi } from 'vitest';

describe('JobApplications Controller', () => {
  const invalidUsernames = ['bad username', 'bad@username', 'badusername!', 'bad#username!'];

  const validUsernames = ['good_username', 'goodUsername', 'goodusername123', 'good.username', 'good-username'];

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
          error: 'Username can only contain letters, numbers, and underscores, with no spaces or special characters',
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
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...userRegistration,
            password: invalidPassword,
            confirmPassword: invalidPassword,
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
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
  });
});
