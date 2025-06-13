import userModel from '../models/userModel.js';
import { updateUserSchema } from '../validations/userSchemas.js';

export const getUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User successfully recovered', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const data = updateUserSchema.parse(req.body);

    if (data.email) {
      const existingEmail = await userModel.findOne({
        email: data.email.toLowerCase(),
        _id: { $ne: req.params.id },
      });

      if (existingEmail) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      data.email = data.email.toLowerCase();
    }

    if (data.username) {
      const existingUsername = await userModel.findOne({
        username: data.username.toLowerCase(),
        _id: { $ne: req.params.id },
      });

      if (existingUsername) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      data.username = data.username.toLowerCase();
    }

    const user = await userModel.findOneAndUpdate({ _id: req.params.id }, data, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User successfully updated', user });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.clearCookie('__jt_token');

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
