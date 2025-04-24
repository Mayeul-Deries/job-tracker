import userModel from '../models/userModel.js';

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
    if (req.body.email) {
      const existingEmail = await userModel.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.body.id },
      });

      if (existingEmail) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      req.body.email = req.body.email.toLowerCase();
    }

    if (req.body.username) {
      const existingUsername = await userModel.findOne({
        username: req.body.username.toLowerCase(),
        _id: { $ne: req.body.id },
      });

      if (existingUsername) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      req.body.username = req.body.username.toLowerCase();
    }

    const user = await userModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User successfully updated', user });
  } catch (error) {
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
