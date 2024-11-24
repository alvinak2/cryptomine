// src/app/api/investments/create/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'
import { INVESTMENT_PLANS } from '@/lib/constants'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const { plan, amount } = await req.json()

    if (!plan || !amount) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Validate plan type
    const planConfig = INVESTMENT_PLANS[plan]
    if (!planConfig) {
      return new Response('Invalid investment plan', { status: 400 })
    }

    // Calculate end date based on plan duration
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + planConfig.duration * 24 * 60 * 60 * 1000)

    await connectDB()

    const investment = await Investment.create({
      userId: session.user.id,
      plan,
      amount,
      status: 'pending',
      startDate,
      endDate,
      paymentConfirmed: false,
      paymentVerified: false,
      createdAt: new Date()
    })

    return new Response(JSON.stringify(investment), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Investment creation error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}