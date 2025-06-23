import fs from 'fs';
import path from 'path';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';
import { updateUserSchema } from '../validations/userSchemas.js';
import { Constants } from '../../src/utils/constants/constants.js';

export const getUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.getUser.invalid_id' });
    }

    const user = await userModel.findOne({ _id: req.params.id });
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
  try {
    const data = updateUserSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.updateUser.invalid_id' });
    }

    if (data.email) {
      const existingEmail = await userModel.findOne({
        email: data.email.toLowerCase(),
        _id: { $ne: req.params.id },
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
        _id: { $ne: req.params.id },
      });

      if (existingUsername) {
        return res
          .status(409)
          .json({ error: 'Username already exists', translationKey: 'user.error.updateUser.existing_username' });
      }

      data.username = data.username.toLowerCase();
    }

    const user = await userModel.findOneAndUpdate({ _id: req.params.id }, data, { new: true });

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
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.updateAvatar.invalid_id' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'User not found', translationKey: 'user.error.updateAvatar.not_found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded', translationKey: 'user.error.updateAvatar.no_file' });
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ error: 'Invalid file type', translationKey: 'user.error.updateAvatar.invalid_type' });
    }

    if (req.file.size > Constants.AVATAR_MAX_SIZE) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'File too large', translationKey: 'user.error.updateAvatar.too_large' });
    }

    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), 'uploads', 'users', 'avatars', path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    const newAvatarUrl = `${req.protocol}://${req.get('host')}/uploads/users/avatars/${req.file.filename}`;

    user.avatar = newAvatarUrl;
    await user.save();

    return res.status(200).json({
      message: 'Avatar updated successfully',
      translationKey: 'user.success.avatar_updated',
      user,
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: 'Unexpected error', translationKey: 'internal_server_error' });
  }
};

export const deleteUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID', translationKey: 'user.error.deleteUser.invalid_id' });
  }

  try {
    const user = await userModel.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found', translationKey: 'user.error.deleteUser.not_found' });
    }
    res.clearCookie('__jt_token');

    res.status(200).json({ message: 'User successfully deleted', translationKey: 'user.success.user_deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};
