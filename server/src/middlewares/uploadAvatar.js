import multer from 'multer';
import { AVATAR_MAX_SIZE } from '../utils/constants/constants.js';

const storage = multer.memoryStorage();

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: AVATAR_MAX_SIZE },
});
