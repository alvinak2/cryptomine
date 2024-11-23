// src/models/wallet.ts
import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
  currency: {
    type: String,
    required: true,
    enum: ['btc', 'eth', 'usdt', 'sol'],
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

walletSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema)