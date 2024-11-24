// src/app/api/dashboard/stats/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'
import { INVESTMENT_PLANS } from '@/lib/constants'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    
    // Get all active investments
    const activeInvestments = await Investment.find({
      userId: session.user.id,
      status: 'active'
    })

    // Calculate total earnings
    const totalEarnings = activeInvestments.reduce((sum, inv) => {
      const planConfig = INVESTMENT_PLANS[inv.plan]
      const startDate = new Date(inv.startDate).getTime()
      const now = new Date().getTime()
      const elapsedDays = Math.min(
        planConfig.duration,
        (now - startDate) / (1000 * 60 * 60 * 24)
      )
      
      const dailyReturnRate = (50 / planConfig.duration) / 100
      const currentEarnings = inv.amount * dailyReturnRate * elapsedDays
      return sum + currentEarnings
    }, 0)

    const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const miningPower = totalInvested * (0.5 + Math.random()) / 100

    const stats = {
      balance: totalInvested + totalEarnings,
      activeInvestments: activeInvestments.length,
      totalEarnings,
      miningPower,
      hasActiveInvestment: activeInvestments.length > 0
    }

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Stats calculation error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}