import userModel from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({ message: 'users successfully recovered', users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {};

export const getUser = async (req, res) => {};

export const updateUser = async (req, res) => {};

export const deleteUser = async (req, res) => {};
