import userModel from '../models/userModel.js';

export const getUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User successfully recovered', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User successfully updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.clearCookie('__jt_token');

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
