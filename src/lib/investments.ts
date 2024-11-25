// src/lib/investments.ts
import { connectDB } from './db'

export async function calculateTotalReturns(userId?: string) {
  const db = await connectDB()
  const investments = db.collection('investments')

  const matchStage = userId ? { userId } : {}
  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalReturns: { $sum: { $multiply: ['$amount', { $divide: ['$returnRate', 100] }] } }
      }
    }
  ]

  const result = await investments.aggregate(pipeline).toArray()
  return result.length > 0 ? result[0].totalReturns : 0
}