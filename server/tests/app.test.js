import request from 'supertest';
import app from '../index.js'; // Importez votre app Express

describe('API Tests', () => {
  it('should return 404 for an unknown route', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  it('should log the request path and method', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    consoleSpy.mockImplementation(() => {});
    await request(app).get('/api');
    expect(consoleSpy).toHaveBeenCalledWith('/api', 'GET');
    consoleSpy.mockRestore();
  });
});
