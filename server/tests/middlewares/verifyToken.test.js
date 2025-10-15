import { describe, it, vi, expect, beforeEach } from 'vitest';
import { verifyToken } from '../../src/middlewares/verifyToken';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import userModel from '../../src/models/userModel.js';

describe('verifyToken middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it('should return 401 if no Authorization header is provided', async () => {
    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not Authenticated' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', async () => {
    req.headers.authorization = 'invalid-token';
    vi.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if userId in token is not a valid ObjectId', async () => {
    req.headers.authorization = 'Bearer valid-token';
    vi.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, { userId: 'invalid-object-id' });
    });

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if user does not exist', async () => {
    const invalidUserId = new mongoose.Types.ObjectId();
    req.headers.authorization = 'Bearer valid-token';
    vi.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, { userId: invalidUserId });
    });
    vi.spyOn(userModel, 'findById').mockImplementation(() => ({
      select: () => Promise.resolve(null),
    }));

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is expired due to password change', async () => {
    const userId = new mongoose.Types.ObjectId();
    req.headers.authorization = 'Bearer valid-token';
    vi.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, { userId, iat: Math.floor(Date.now() / 1000) - 1000 });
    });
    vi.spyOn(userModel, 'findById').mockImplementation(() => ({
      select: () => Promise.resolve({ passwordChangedAt: new Date(Date.now() - 500 * 1000) }),
    }));

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token expired due to password change' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and set req.userId if token is valid and user exists', async () => {
    const userId = new mongoose.Types.ObjectId();
    req.headers.authorization = 'Bearer valid-token';
    vi.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, { userId, iat: Math.floor(Date.now() / 1000) });
    });

    vi.spyOn(userModel, 'findById').mockImplementation(() => ({
      select: () => Promise.resolve({ passwordChangedAt: null }),
    }));

    await verifyToken(req, res, next);

    expect(req.userId).toBe(userId);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
