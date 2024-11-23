// src/app/api/admin/investments/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'
import { User } from '@/models/user'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    await connectDB()

    // Build query based on status filter
    const query = status && status !== 'all' ? { status } : {}

    const investments = await Investment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name email')

    // Format investments with user details
    const formattedInvestments = investments.map(inv => ({
      _id: inv._id,
      userName: inv.userId.name,
      userEmail: inv.userId.email,
      plan: inv.plan,
      amount: inv.amount,
      status: inv.status,
      paymentMethod: inv.paymentMethod,
      createdAt: inv.createdAt
    }))

    const total = await Investment.countDocuments(query)

    return new Response(
      JSON.stringify({
        investments: formattedInvestments,
        total,
        pages: Math.ceil(total / limit)
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Fetch investments error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}