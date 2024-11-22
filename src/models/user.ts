import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  investments: [{
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    startDate: Date,
    endDate: Date,
    returns: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);