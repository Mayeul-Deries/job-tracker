import mongoose from 'mongoose';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { connectDB } from '../../src/database/connectToDB.js';

describe('connectDB', () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let mongooseConnectSpy;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mongooseConnectSpy = vi.spyOn(mongoose, 'connect').mockResolvedValue();
    vi.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should connect to the database successfully', async () => {
    await connectDB();

    expect(mongooseConnectSpy).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB connected ✅');
  });

  it('should log an error message and exit the process on connection failure', async () => {
    const mockError = new Error('Connection error');
    mongooseConnectSpy.mockRejectedValueOnce(mockError);

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith('MongoDB connexion error ❌', mockError);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
