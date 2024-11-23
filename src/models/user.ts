// src/models/user.ts
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  investments: [{
    plan: {
      type: String,
      required: true,
      enum: ['Basic', 'Pro', 'Elite']
    },
    amount: {
      type: Number,
      required: true
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
    }
  }],
  walletAddresses: {
    btc: String,
    eth: String,
    usdt: String,
    sol: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const User = mongoose.models.User || mongoose.model('User', userSchema)