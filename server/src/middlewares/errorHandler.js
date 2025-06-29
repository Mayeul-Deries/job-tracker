import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        translationKey: 'user.error.updateAvatar.too_large',
      });
    }
    return res.status(400).json({
      error: 'Multer error',
      translationKey: 'user.error.updateAvatar.upload_error',
    });
  }
};
