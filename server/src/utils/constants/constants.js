export const Constants = {
  MAX_DURATION_COOKIE: '30d', // 30 days
  MAX_DURATION_RESET_TOKEN: '15m', // 15 minutes
  USERNAME_REGEX: /^[a-zA-Z0-9._-]+$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:.]).{8,}$/,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  AVATAR_MAX_SIZE: 3 * 1024 * 1024,
};
