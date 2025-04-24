import request from 'supertest';
import { vi, describe, it, expect } from 'vitest';
import app from '../src/app.js';
import '../src/server.js';

describe('Express App', () => {
  it('should be a valid Express instance', () => {
    expect(app).toBeDefined();
    expect(typeof app.use).toBe('function');
  });

  it('should return 404 for an unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });

  it('should log the request path and method', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    consoleSpy.mockImplementation(() => {});
    await request(app).get('/api');
    expect(consoleSpy).toHaveBeenCalledWith('/api', 'GET');
    consoleSpy.mockRestore();
  });
});
