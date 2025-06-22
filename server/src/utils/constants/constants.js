export const Constants = {
  MAX_DURATION_COOKIE: 1000 * 60 * 60 * 24 * 30, // 30 days
  USERNAME_REGEX: /^[a-zA-Z0-9._-]+$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:.]).{8,}$/,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  AVATAR_MAX_SIZE: 3 * 1024 * 1024,
};
