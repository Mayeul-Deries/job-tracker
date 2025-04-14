import bcrypt from 'bcryptjs';
import { Constants } from '../utils/constants/constants.js';
import { generateToken } from '../utils/generateToken.js';
import userModel from '../models/userModel.js';

export const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!Constants.USERNAME_REGEX.test(username)) {
    return res.status(400).json({
      message: 'Username can only contain letters, numbers, and underscores, with no spaces or special characters',
    });
  }

  if (!Constants.PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      message:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    if (await userModel.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    if (await userModel.findOne({ username: username.toLowerCase() })) {
      return res.status(409).json({ message: 'Username already exists' });
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
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(201).json({ message: 'User successfully created', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;
  if (!(username || email) || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const query = {
      $or: [
        ...(username ? [{ username: username.toLowerCase() }] : []),
        ...(email ? [{ email: email.toLowerCase() }] : []),
      ],
    };

    const user = await userModel.findOne(query).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.cookie('__jt_token', token, {
      maxAge: Constants.MAX_DURATION_COOKIE,
      httpOnly: true,
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(200).json({ message: 'User successfully logged in', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('__jt_token');
    res.status(200).json({ message: 'User successfully logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
