// src/app/api/investments/[id]/withdraw/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'
import { User } from '@/models/user'
import { INVESTMENT_PLANS } from '@/lib/constants'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    
    const investment = await Investment.findById(params.id)
      .populate('userId', 'balance')

    if (!investment) {
      return new Response('Investment not found', { status: 404 })
    }

    // Verify ownership and status
    if (investment.userId._id.toString() !== session.user.id || 
        investment.status !== 'active') {
      return new Response('Unauthorized', { status: 401 })
    }

    // Check if investment period is completed
    const now = new Date()
    const endDate = new Date(investment.endDate)
    if (now < endDate) {
      return new Response('Investment period not completed', { status: 400 })
    }

    // Calculate final returns
    const plan = investment.plan as keyof typeof INVESTMENT_PLANS
    const returnRate = INVESTMENT_PLANS[plan].return
    const totalReturn = investment.amount * (1 + returnRate/100)

    // Update investment status
    investment.status = 'completed'
    investment.returns = totalReturn - investment.amount
    await investment.save()

    // Update user balance
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { balance: totalReturn }
    })

    return new Response(JSON.stringify({
      message: 'Withdrawal successful',
      amount: totalReturn,
      investment: investment
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Withdrawal error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}