import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '../validations/authSchemas.js';
import { Constants } from '../utils/constants/constants.js';
import { generateToken } from '../utils/generateToken.js';
import userModel from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    const existingEmail = await userModel.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res
        .status(409)
        .json({ error: 'Email already exists', translationKey: 'auth.error.register.existing_email' });
    }

    const existingUsername = await userModel.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res
        .status(409)
        .json({ error: 'Username already exists', translationKey: 'auth.error.register.existing_username' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const token = generateToken(user._id);

    res.cookie('__jt_token', token, {
      maxAge: Constants.MAX_DURATION_COOKIE,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      message: 'User successfully created',
      user: userWithoutPassword,
      translationKey: 'auth.success.register',
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

    const token = generateToken(user._id);
    res.cookie('__jt_token', token, {
      maxAge: Constants.MAX_DURATION_COOKIE,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(200).json({
      message: 'User successfully logged in',
      user: userWithoutPassword,
      translationKey: 'auth.success.login',
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('__jt_token');
    res.status(200).json({ message: 'User successfully logged out', translationKey: 'auth.success.logout' });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const getConnectedUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};
