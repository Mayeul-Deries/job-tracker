import mongoose from 'mongoose';
import { StatusOffer } from '../utils/enums/statusOffer.js';

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
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
);

export default mongoose.model('JobApplication', jobApplicationSchema);
