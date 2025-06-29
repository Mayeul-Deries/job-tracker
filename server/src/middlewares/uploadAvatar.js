import multer from 'multer';
import { Constants } from '../utils/constants/constants.js';

const storage = multer.memoryStorage();

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: Constants.AVATAR_MAX_SIZE },
});
