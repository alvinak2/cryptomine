// src/app/api/admin/stats/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'
import { Investment } from '@/models/investment'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()

    const [
      totalUsers,
      pendingInvestments,
      activeInvestments,
      totalInvested
    ] = await Promise.all([
      User.countDocuments({}),
      Investment.countDocuments({ status: 'pending' }),
      Investment.countDocuments({ status: 'active' }),
      Investment.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ])

    return new Response(JSON.stringify({
      totalUsers,
      pendingInvestments,
      activeInvestments,
      totalInvested: totalInvested[0]?.total || 0
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}