// src/models/transaction.ts
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  type: {
    type: String,
    enum: ['investment', 'withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: String,
  walletAddress: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)