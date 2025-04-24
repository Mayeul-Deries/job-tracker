import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies['__jt_token'];

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.userId = payload.userId;
    next();
  });
};
