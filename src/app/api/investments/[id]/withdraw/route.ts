// src/app/api/investments/[id]/withdraw/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'
import { Investment } from '@/models/investment'
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

    if (!investment) {
      return new Response('Investment not found', { status: 404 })
    }

    const planConfig = INVESTMENT_PLANS[investment.plan as keyof typeof INVESTMENT_PLANS]
    const startDate = new Date(investment.startDate)
    const now = new Date()
    const endDate = new Date(investment.endDate)
    
    if (now < endDate) {
      return new Response('Investment period not completed', { status: 400 })
    }

    // Calculate total return (initial investment + profit)
    const totalProfit = investment.amount * (planConfig.return / 100)
    const totalReturn = investment.amount + totalProfit

    // Update investment status
    investment.status = 'completed'
    investment.returns = totalProfit
    await investment.save()

    // Update user balance with total amount (initial + profit)
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { balance: totalReturn }
    })

    return new Response(JSON.stringify({
      message: 'Withdrawal successful',
      investment,
      totalReturn,
      profit: totalProfit
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Withdrawal error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}