import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies['__jt_token'];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.userId = payload.userId;
    next();
  });
};
