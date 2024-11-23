// src/models/investment.ts
import mongoose from 'mongoose'

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    required: true,
    enum: ['Basic', 'Pro', 'Elite']
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['btc', 'eth', 'usdt', 'sol']
  },
  paymentConfirmed: {
    type: Boolean,
    default: false
  },
  paymentVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'rejected'],
    default: 'pending'
  },
  startDate: Date,
  endDate: Date,
  returns: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Investment = mongoose.models.Investment || mongoose.model('Investment', investmentSchema)