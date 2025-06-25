import mongoose from 'mongoose';
import { Categories } from '../utils/enums/categories.js';

const userSchema = new mongoose.Schema(
  {
    avatar: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    preferredCategory: {
      type: String,
      enum: Object.values(Categories),
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
