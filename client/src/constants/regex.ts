export const Regex = {
  LOGIN_NAME: /^[^A-Z\s]+$/,
  USERNAME: /^[a-z0-9_-]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
  OTP_ONLY_DIGITS: /^[0-9]*$/,
};
