import { v4 as uuidv4 } from 'uuid';
import request from 'supertest';
import app from '../../src/app.js';
import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';
import { defaultUser, otherUser, userWithAvatar, userWithPreferredCategory } from '../fixtures/userFixture.js';
import { defaultJobApplication, otherJobApplication } from '../fixtures/jobApplicationFixture.js';
import { Categories } from '../../src/utils/enums/categories.js';
import mongoose from 'mongoose';
import { generateToken } from '../../src/utils/generateToken.js';
import User from '../../src/models/userModel.js';
import JobApplication from '../../src/models/jobApplicationModel.js';
import bcrypt from 'bcryptjs';
import { describe, expect, it, vi } from 'vitest';
import { Constants } from '../../src/utils/constants/constants.js';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Writable } from 'stream';

vi.mock('cloudinary', () => {
  return {
    v2: {
      config: vi.fn(),
      uploader: {
        destroy: vi.fn().mockResolvedValue({ result: 'ok' }),
        upload_stream: vi.fn((options, callback) => {
          const writable = new Writable({
            write(chunk, encoding, done) {
              // On ignore les chunks, on simule simplement le traitement
              done();
            },
            final(done) {
              // On simule un résultat Cloudinary une fois le stream terminé
              callback(null, {
                secure_url: 'https://res.cloudinary.com/test/image/upload/v123/avatar.png',
              });
              done();
            },
          });

          return writable;
        }),
      },
    },
  };
});

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
      const user = await User.create(userWithPreferredCategory);

      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User successfully recovered',
        user: {
          username: user.username,
          email: user.email,
          preferredCategory: Categories.FULL_TIME,
        },
      });
    });

    it('should return 400 if user ID is invalid', async () => {
      const invalidId = 'invalid-id-format';

      const res = await request(app)
        .get(`/api/users/${invalidId}`)
        .set('Authorization', `Bearer ${generateToken(invalidId)}`);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: 'Invalid ID',
      });
    });

    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${generateToken(nonExistentUserId)}`);

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
        .set('Authorization', `Bearer ${generateToken(userId)}`);

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
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
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

    it('should return 200 and updated user preferred category if value is changed', async () => {
      const user = await User.create(userWithPreferredCategory);
      const updatedData = { preferredCategory: Categories.APPRENTICESHIP };

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User successfully updated',
        user: {
          preferredCategory: updatedData.preferredCategory,
        },
      });
    });

    it('should return 400 if user ID is invalid', async () => {
      const invalidId = 'invalid-id-format';

      const res = await request(app)
        .put(`/api/users/${invalidId}`)
        .set('Authorization', `Bearer ${generateToken(invalidId)}`)
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
        .set('Authorization', `Bearer ${generateToken(user._id)}`);
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Email already exists');
    });

    it('should return a 409 if the username already exists', async () => {
      const user = await User.create(defaultUser);
      await User.create(otherUser);

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ username: 'janedoe' })
        .set('Authorization', `Bearer ${generateToken(user._id)}`);
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Username already exists');
    });

    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/users/${nonExistentUserId}`)
        .send({ username: 'johndoe' })
        .set('Authorization', `Bearer ${generateToken(nonExistentUserId)}`);

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
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
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
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
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
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
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
        .set('Authorization', `Bearer ${generateToken(userId)}`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        error: 'Server error',
      });
    });
  });

  describe('updatePassword', () => {
    let user;
    const currentPassword = 'Johndoe123*';
    const newPassword = 'NewPassword1!';

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(currentPassword, 10);
      user = await User.create({
        ...defaultUser,
        password: hashedPassword,
      });
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    it('should update the password and return 200', async () => {
      const res = await request(app)
        .put(`/api/users/${user._id}/password`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send({
          currentPassword,
          newPassword,
          newPasswordConfirm: newPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Password updated successfully',
      });

      const updatedUser = await User.findById(user._id).select('+password');
      const passwordMatches = await bcrypt.compare(newPassword, updatedUser.password);
      expect(passwordMatches).toBe(true);
    });

    it('should return 400 for invalid user ID', async () => {
      const res = await request(app)
        .put(`/api/users/invalid-id/password`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send({
          currentPassword,
          newPassword,
          newPasswordConfirm: newPassword,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid ID');
    });

    it('should return 404 if user is not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/users/${fakeId}/password`)
        .set('Authorization', `Bearer ${generateToken(fakeId)}`)
        .send({
          currentPassword,
          newPassword,
          newPasswordConfirm: newPassword,
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });

    it('should return 401 if current password is incorrect', async () => {
      const res = await request(app)
        .put(`/api/users/${user._id}/password`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send({
          currentPassword: 'WrongPassword1!',
          newPassword,
          newPasswordConfirm: newPassword,
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Current password is incorrect');
    });

    it('should return 400 if new password is the same as old password', async () => {
      const res = await request(app)
        .put(`/api/users/${user._id}/password`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send({
          currentPassword,
          newPassword: currentPassword,
          newPasswordConfirm: currentPassword,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('New password must differ from current');
    });

    it("should return 400 if new password doesn't match regex", async () => {
      const res = await request(app)
        .put(`/api/users/${user._id}/password`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send({
          currentPassword,
          newPassword: 'weakpass',
          newPasswordConfirm: 'weakpass',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
    });

    it('should return 400 if new passwords do not match', async () => {
      const res = await request(app)
        .put(`/api/users/${user._id}/password`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send({
          currentPassword,
          newPassword,
          newPasswordConfirm: 'DifferentPassword1!',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Passwords don't match");
    });

    it('should return 400 if validation fails (missing fields)', async () => {
      const res = await request(app)
        .put(`/api/users/${user._id}/password`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send({
          newPassword,
          newPasswordConfirm: newPassword,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Required');
    });

    it('should return 500 if server error occurs', async () => {
      vi.spyOn(User, 'findById').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const res = await request(app)
        .put(`/api/users/${user._id}/password`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .send({
          currentPassword,
          newPassword,
          newPasswordConfirm: newPassword,
        });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ error: 'Server error' });
    });
  });

  describe('updateAvatar', () => {
    it('should delete old Cloudinary avatar and upload a new one', async () => {
      const user = await User.create(userWithAvatar);

      const newAvatarPath = path.join(__dirname, '../fixtures/test-new-avatar.png');
      fs.writeFileSync(newAvatarPath, 'fake-avatar-content');

      const response = await request(app)
        .put(`/api/users/${user._id}/avatar`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .attach('avatar', newAvatarPath);

      // on supprime le fichier avant les expect pour eviter qu'une erreur empâche la suppression
      fs.unlinkSync(newAvatarPath);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Avatar updated successfully');
      expect(response.body.user.avatar).toContain('cloudinary.com');
    });

    it('should return 400 if ID is invalid', async () => {
      const user = await User.create(userWithAvatar);

      const newAvatarPath = path.join(__dirname, '../fixtures/test-new-avatar.png');
      fs.writeFileSync(newAvatarPath, 'fake-avatar-content');

      const response = await request(app)
        .put(`/api/users/invalid-id/avatar`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .attach('avatar', newAvatarPath);

      fs.unlinkSync(newAvatarPath);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid ID');
    });

    it('should return 404 if user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const newAvatarPath = path.join(__dirname, '../fixtures/test-new-avatar.png');
      fs.writeFileSync(newAvatarPath, 'fake-avatar-content');

      const response = await request(app)
        .put(`/api/users/${nonExistentUserId}/avatar`)
        .set('Authorization', `Bearer ${generateToken(nonExistentUserId)}`)
        .attach('avatar', newAvatarPath);

      fs.unlinkSync(newAvatarPath);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 400 if no file is uploaded', async () => {
      const user = await User.create(userWithAvatar);

      const response = await request(app)
        .put(`/api/users/${user._id}/avatar`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('No file uploaded');
    });

    it('should return 400 if file type is not allowed', async () => {
      const user = await User.create(userWithAvatar);

      const newAvatarPath = path.join(__dirname, '../fixtures/test-new-avatar.txt');
      fs.writeFileSync(newAvatarPath, 'fake-avatar-content');

      const response = await request(app)
        .put(`/api/users/${user._id}/avatar`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .attach('avatar', newAvatarPath);

      fs.unlinkSync(newAvatarPath);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid file type');
    });

    it('should return 400 if the file is too large', async () => {
      const user = await User.create(userWithAvatar);

      const largeBuffer = Buffer.alloc(6 * 1024 * 1024);

      const res = await request(app)
        .put(`/api/users/${user._id}/avatar`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .attach('avatar', largeBuffer, { filename: 'big.jpg', contentType: 'image/jpeg' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('File too large');
    });

    it('should return 400 with generic Multer error when wrong file field is used', async () => {
      const user = await User.create(defaultUser);

      const res = await request(app)
        .put(`/api/users/${user._id}/avatar`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .attach('wrongField', Buffer.from('fake-image-content'), {
          filename: 'avatar.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'Multer error',
        translationKey: 'user.error.updateAvatar.upload_error',
      });
    });

    it('should return 500 if an unexpected server error occurs', async () => {
      const userId = new mongoose.Types.ObjectId();

      vi.spyOn(User, 'findById').mockImplementationOnce(() => {
        throw new Error('Unexpected server error');
      });

      const newAvatarPath = path.join(__dirname, '../fixtures/avatar.png');
      fs.writeFileSync(newAvatarPath, 'fake-avatar');

      const res = await request(app)
        .put(`/api/users/${userId}/avatar`)
        .set('Authorization', `Bearer ${generateToken(userId)}`)
        .attach('avatar', newAvatarPath);

      fs.unlinkSync(newAvatarPath);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        error: 'Unexpected server error',
        translationKey: 'internal_server_error',
      });
    });

    it('should return 500 if cloudinary upload fails', async () => {
      const user = await User.create(defaultUser);

      cloudinary.uploader.upload_stream.mockImplementationOnce((options, callback) => {
        const writable = new Writable({
          write(chunk, encoding, done) {
            done();
          },
          final(done) {
            callback(new Error('Upload failed'), null);
            done();
          },
        });

        return writable;
      });

      const buffer = Buffer.from('valid-image-content');

      const res = await request(app)
        .put(`/api/users/${user._id}/avatar`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`)
        .attach('avatar', buffer, { filename: 'avatar.png', contentType: 'image/png' });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        error: 'Upload failed',
        translationKey: 'internal_server_error',
      });
    });

    it('should continue even if deleting the old avatar fails', async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = {
        _id: userId,
        avatar: 'https://res.cloudinary.com/demo/image/upload/v1/users/avatars/old-avatar.jpg',
        save: vi.fn(),
      };

      vi.spyOn(User, 'findById').mockResolvedValue(user);

      cloudinary.uploader.destroy = vi.fn().mockRejectedValueOnce(new Error('Cloudinary destroy failed'));

      cloudinary.uploader.upload_stream = vi.fn((options, callback) => {
        return new Writable({
          write(chunk, encoding, done) {
            done();
          },
          final(done) {
            callback(null, { secure_url: 'https://cloudinary.com/fake/new-avatar.png' });
            done();
          },
        });
      });

      const avatarPath = path.join(__dirname, '../fixtures/avatar.jpg');
      fs.writeFileSync(avatarPath, 'fake-avatar');

      const res = await request(app)
        .put(`/api/users/${userId}/avatar`)
        .set('Authorization', `Bearer ${generateToken(userId)}`)
        .attach('avatar', avatarPath);

      fs.unlinkSync(avatarPath);

      expect(res.status).toBe(200);
      expect(user.save).toHaveBeenCalled();
      expect(res.body.user.avatar).toBe('https://cloudinary.com/fake/new-avatar.png');
    });
  });

  describe('deleteUser', () => {
    it('should return 200 and delete the user when user is found', async () => {
      const user = await User.create(defaultUser);

      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User successfully deleted',
      });
    });

    it('should return delete the user and all job applications associated', async () => {
      const user = await User.create(defaultUser);
      const jobApplication = await JobApplication.create({
        ...defaultJobApplication,
        userId: user._id,
      });
      const anOtherJobApplication = await JobApplication.create({
        ...otherJobApplication,
        userId: user._id,
      });

      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User successfully deleted',
      });
      expect(res.body.deletedJobApplicationsCount).toBe(2);
    });

    it('should return 200 and delete user avatar when user has an avatar', async () => {
      const user = await User.create(userWithAvatar);
      const destroyMock = cloudinary.uploader.destroy;

      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User successfully deleted',
        translationKey: 'user.success.user_deleted',
      });

      expect(destroyMock).toHaveBeenCalledWith('users/avatars/test-avatar');
    });

    it('should log a warning if cloudinary destroy fails', async () => {
      const user = await User.create(userWithAvatar);

      const destroyMock = cloudinary.uploader.destroy;
      destroyMock.mockRejectedValueOnce(new Error('Cloudinary error'));

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`);

      expect(res.status).toBe(200);
      expect(warnSpy).toHaveBeenCalledWith('Failed to delete avatar on Cloudinary:', 'Cloudinary error');

      warnSpy.mockRestore();
    });

    it('should return 400 if user ID is invalid', async () => {
      const invalidId = 'invalid-id-format';

      const res = await request(app)
        .delete(`/api/users/${invalidId}`)
        .set('Authorization', `Bearer ${generateToken(invalidId)}`);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: 'Invalid ID',
      });
    });
    it('should return 404 when user is not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${generateToken(nonExistentUserId)}`);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        error: 'User not found',
      });
    });

    it('should return 500 if a server error occurs when deleting job applications associated to the user', async () => {
      const user = await User.create(defaultUser);

      vi.spyOn(JobApplication, 'deleteMany').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const res = await request(app)
        .delete(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${generateToken(user._id)}`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        error: 'Server error',
      });
    });

    it('should return 500 if a server error occurs', async () => {
      const userId = new mongoose.Types.ObjectId();

      vi.spyOn(User, 'findOneAndDelete').mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${generateToken(userId)}`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        error: 'Server error',
      });
    });
  });
});
