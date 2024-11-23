// src/app/api/admin/payments/verify/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
      }

    const { investmentId, status } = await req.json()
    await connectDB()

    const investment = await Investment.findById(investmentId)
    if (!investment) {
      return new Response('Investment not found', { status: 404 })
    }

    if (status === 'approved') {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + getDuration(investment.plan))

      investment.status = 'active'
      investment.paymentVerified = true
      investment.startDate = startDate
      investment.endDate = endDate
    } else {
      investment.status = 'rejected'
    }

    await investment.save()

    return new Response(JSON.stringify(investment), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}

function getDuration(plan: string): number {
  const durations = {
    'Basic': 30,
    'Pro': 20,
    'Elite': 10
  }
  return durations[plan as keyof typeof durations] || 30
}