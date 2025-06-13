export const Regex = {
  LOGIN_NAME: /^[^A-Z\s]+$/,
  USERNAME: /^[a-z0-9_-]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:.]).{8,}$/,
};
