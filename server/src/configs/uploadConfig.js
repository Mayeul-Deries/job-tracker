import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crée le dossier si inexistant
const uploadDir = path.resolve('./uploads/users/avatars');
fs.mkdirSync(uploadDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.params.id}_${Date.now()}${ext}`);
  },
});

export const uploadAvatar = multer({ storage: avatarStorage });
