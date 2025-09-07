import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Not Authenticated' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // renvoyer une erreur (déconnecter si le mot de passe est changé)
    const user = await userModel.findById(payload.userId).select('passwordChangedAt');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(401).json({ error: 'Token expired due to password change' });
    }

    req.userId = payload.userId;
    next();
  });
};
