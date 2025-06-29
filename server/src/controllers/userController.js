import userModel from '../models/userModel.js';
import jobApplicationModel from '../models/jobApplicationModel.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { updateUserSchema, updatePasswordSchema } from '../validations/userSchemas.js';
import cloudinary from '../../src/configs/cloudinary.js';
import streamifier from 'streamifier';
import { Constants } from '../utils/constants/constants.js';

export const getUser = async (req, res) => {
  const id = req.params.id.toString();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.getUser.invalid_id' });
    }

    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ error: 'User not found', translationKey: 'user.error.getUser.not_found' });
    }
    res
      .status(200)
      .json({ message: 'User successfully recovered', user, translationKey: 'user.success.user_recovered' });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id.toString();

  try {
    const data = updateUserSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.updateUser.invalid_id' });
    }

    if (data.email) {
      const existingEmail = await userModel.findOne({
        email: data.email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingEmail) {
        return res
          .status(409)
          .json({ error: 'Email already exists', translationKey: 'user.error.updateUser.existing_email' });
      }

      data.email = data.email.toLowerCase();
    }

    if (data.username) {
      const existingUsername = await userModel.findOne({
        username: data.username.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingUsername) {
        return res
          .status(409)
          .json({ error: 'Username already exists', translationKey: 'user.error.updateUser.existing_username' });
      }

      data.username = data.username.toLowerCase();
    }

    const user = await userModel.findOneAndUpdate({ _id: id }, data, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found', translationKey: 'user.error.updateUser.not_found' });
    }
    res.status(200).json({ message: 'User successfully updated', user, translationKey: 'user.success.user_updated' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const updateAvatar = async (req, res) => {
  const id = req.params.id.toString();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.updateAvatar.invalid_id' });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found', translationKey: 'user.error.updateAvatar.not_found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded', translationKey: 'user.error.updateAvatar.no_file' });
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ error: 'Invalid file type', translationKey: 'user.error.updateAvatar.invalid_type' });
    }

    if (user.avatar) {
      // Extraire le public_id de l'URL pour supprimer l'ancien fichier
      const publicId = user.avatar.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`users/avatars/${publicId}`);
      } catch (e) {
        console.warn('Failed to delete old avatar:', e.message);
      }
    }

    const streamUpload = fileBuffer => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'users/avatars',
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    user.avatar = result.secure_url;
    await user.save();

    return res.status(200).json({
      message: 'Avatar updated successfully',
      translationKey: 'user.success.avatar_updated',
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const updatePassword = async (req, res) => {
  const id = req.params.id.toString();

  try {
    const { currentPassword, newPassword } = updatePasswordSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.updatePassword.invalid_id' });
    }

    const user = await userModel.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found', translationKey: 'user.error.updatePassword.not_found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: 'Current password is incorrect', translationKey: 'user.error.updatePassword.wrong_password' });
    }

    const sameAsOld = await bcrypt.compare(newPassword, user.password);
    if (sameAsOld) {
      return res.status(400).json({
        error: 'New password must differ from current',
        translationKey: 'user.error.updatePassword.same_password',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Password updated successfully', translationKey: 'user.success.password_updated' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id.toString();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.deleteUser.invalid_id' });
  }

  try {
    const user = await userModel.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(404).json({ error: 'User not found', translationKey: 'user.error.deleteUser.not_found' });
    }

    let deletedApplicationsResult = null;

    try {
      deletedApplicationsResult = await jobApplicationModel.deleteMany({ userId: id });
    } catch (error) {
      return res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
    }

    if (user.avatar) {
      try {
        const publicId = user.avatar.split('/').pop().split('.')[0]; // extrait le nom de fichier
        await cloudinary.uploader.destroy(`users/avatars/${publicId}`);
      } catch (err) {
        console.warn('Failed to delete avatar on Cloudinary:', err.message);
      }
    }

    res.clearCookie('__jt_token');

    res.status(200).json({
      message: 'User successfully deleted',
      translationKey: 'user.success.user_deleted',
      deletedJobApplicationsCount: deletedApplicationsResult?.deletedCount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};
