import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies['__jt_token'];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.userId = user._id;
    next();
  });
};
