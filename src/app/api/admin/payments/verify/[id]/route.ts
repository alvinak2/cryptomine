// src/app/api/admin/payments/verify/[id]/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    const { status } = await req.json()
    await connectDB()

    const investment = await Investment.findById(params.id)
    if (!investment) {
      return new Response('Investment not found', { status: 404 })
    }

    // Update investment status and verification
    investment.status = status === 'approved' ? 'active' : 'rejected'
    investment.paymentVerified = status === 'approved'
    
    if (status === 'approved') {
      investment.startDate = new Date()
      const duration = investment.plan === 'Basic' ? 30 : 
                      investment.plan === 'Pro' ? 20 : 10
      investment.endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
    }

    await investment.save()

    return new Response(JSON.stringify(investment), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}