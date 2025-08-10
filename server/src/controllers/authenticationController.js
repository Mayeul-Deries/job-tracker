import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/authSchemas.js';
import { Constants } from '../utils/constants/constants.js';
import { generateToken } from '../utils/generateToken.js';
import { sendResetCodeEmail } from '../utils/sendResetCodeEmail.js';
import userModel from '../models/userModel.js';
import passwordResetModel from '../models/passwordResetModel.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    const existingUsername = await userModel.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res
        .status(409)
        .json({ error: 'Username already exists', translationKey: 'auth.error.register.existing_username' });
    }

    const existingEmail = await userModel.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res
        .status(409)
        .json({ error: 'Email already exists', translationKey: 'auth.error.register.existing_email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const accessToken = generateToken(user._id);

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      message: 'User successfully created',
      user: userWithoutPassword,
      translationKey: 'auth.success.register',
      accessToken,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const login = async (req, res) => {
  try {
    const { loginName, password } = loginSchema.parse(req.body);

    const isEmail = Constants.EMAIL_REGEX.test(loginName);
    const query = {
      [isEmail ? 'email' : 'username']: loginName.toLowerCase(),
    };

    const user = await userModel.findOne(query).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found', translationKey: 'auth.error.login.not_found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: 'Invalid credentials', translationKey: 'auth.error.login.invalid_credentials' });
    }

    const accessToken = generateToken(user._id);

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(200).json({
      message: 'User successfully logged in',
      user: userWithoutPassword,
      translationKey: 'auth.success.login',
      accessToken,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ message: 'User successfully logged out', translationKey: 'auth.success.logout' });
};

export const getConnectedUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found', translationKey: 'auth.error.forgot_password.user_not_found' });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expire dans 10 minutes

    await passwordResetModel.findOneAndUpdate(
      { email },
      { code, expiresAt, attempts: 0, used: false },
      { upsert: true, new: true }
    );

    await sendResetCodeEmail(email, code);

    return res.status(200).json({
      message: 'Reset code sent successfully',
      translationKey: 'auth.success.code_sent',
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await passwordResetModel.findOne({ email });

    if (!record) {
      return res.status(400).json({
        error: 'Code not found',
        translationKey: 'auth.error.verify_reset_code.code_not_found',
      });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        error: 'Too many attempts',
        translationKey: 'auth.error.verify_reset_code.too_many_attempts',
      });
    }

    if (record.used) {
      return res
        .status(400)
        .json({ error: 'Code already used', translationKey: 'auth.error.verify_reset_code.code_used' });
    }

    if (record.code !== code) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        error: 'Invalid code',
        translationKey: 'auth.error.verify_reset_code.invalid_code',
      });
    }

    if (record.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ error: 'Code expired', translationKey: 'auth.error.verify_reset_code.code_expired' });
    }

    record.used = true;
    await record.save();

    const token = jwt.sign({ email }, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: Constants.MAX_DURATION_RESET_PASSWORD,
    });

    return res.status(200).json({
      message: 'Code verified successfully',
      translationKey: 'auth.success.verify_reset_code',
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token missing or invalid',
        translationKey: 'auth.error.reset_password.token_missing',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    } catch (err) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        translationKey: 'auth.error.reset_password.token_invalid',
      });
    }

    const { newPassword } = resetPasswordSchema.parse(req.body);

    const user = await userModel.findOne({ email: decoded.email }).select('+password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        translationKey: 'auth.error.reset_password.user_not_found',
      });
    }

    const sameAsOld = await bcrypt.compare(newPassword, user.password);
    if (sameAsOld) {
      return res.status(400).json({
        error: 'New password must differ from current',
        translationKey: 'auth.error.reset_password.same_password',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successfully',
      translationKey: 'auth.success.reset_password',
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({
      error: error.message,
      translationKey: 'internal_server_error',
    });
  }
};
