import jwt from 'jsonwebtoken';
import { Constants } from './constants/constants.js';

export const generateToken = userId => {
  return jwt.sign({ userId }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: Constants.MAX_DURATION_COOKIE,
  });
};
