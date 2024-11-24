// src/app/api/admin/investments/recent/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    const investments = await Investment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)

    const formattedInvestments = investments.map(inv => ({
      _id: inv._id,
      userName: inv.userId.name,
      userEmail: inv.userId.email,
      plan: inv.plan,
      amount: inv.amount,
      status: inv.status,
      createdAt: inv.createdAt
    }))

    return new Response(JSON.stringify(formattedInvestments), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}