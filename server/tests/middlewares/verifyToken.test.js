import { describe, it, vi, expect, beforeEach } from 'vitest';
import { verifyToken } from '../../src/middlewares/verifyToken';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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

  it('should call next and set userId if token is valid', async () => {
    const userId = new mongoose.Types.ObjectId();
    req.headers.authorization = 'valid-token';
    vi.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, { userId });
    });

    await verifyToken(req, res, next);

    expect(req.userId).toBe(userId);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
