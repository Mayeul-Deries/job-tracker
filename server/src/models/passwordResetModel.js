import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    used: { type: Boolean, default: false },
    resetToken: { type: String },
    tokenUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('PasswordReset', passwordResetSchema);
