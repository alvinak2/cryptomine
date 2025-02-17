// src/app/api/admin/payments/pending/route.ts
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

    const pendingInvestments = await Investment.find({
      status: 'pending_verification',
      paymentConfirmed: true,
      paymentVerified: false
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })

    const formatted = pendingInvestments.map(inv => ({
      _id: inv._id,
      userName: inv.userId.name,
      userEmail: inv.userId.email,
      plan: inv.plan,
      amount: inv.amount,
      paymentMethod: inv.paymentMethod,
      createdAt: inv.createdAt
    }))

    return new Response(JSON.stringify(formatted), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching pending payments:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}