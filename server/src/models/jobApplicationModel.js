import mongoose from 'mongoose';
import { StatusOffer } from '../utils/enums/statusOffer.js';
import { Categories } from '../utils/enums/categories.js';

const jobApplicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    link: { type: String },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(StatusOffer),
      default: StatusOffer.SENT,
    },
    notes: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: Object.values(Categories),
    },
  },
  { timestamps: true }
);

export default mongoose.model('JobApplication', jobApplicationSchema);
