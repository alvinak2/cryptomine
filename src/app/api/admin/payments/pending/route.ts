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
    const pendingPayments = await Investment.find({ 
      paymentConfirmed: true,
      paymentVerified: false,
      status: 'pending'
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })

    const formatted = pendingPayments.map(payment => ({
      _id: payment._id,
      userName: payment.userId.name,
      userEmail: payment.userId.email,
      plan: payment.plan,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt
    }))

    return new Response(JSON.stringify(formatted), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}