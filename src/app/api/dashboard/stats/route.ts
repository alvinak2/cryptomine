// src/app/api/dashboard/stats/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()

    const activeInvestments = await Investment.find({
      userId: session.user.id,
      status: 'active'
    })

    const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const hasActiveInvestment = activeInvestments.length > 0

    // Calculate earnings based on investment duration and return rate
    const totalEarnings = activeInvestments.reduce((sum, inv) => {
      const durationInDays = (Date.now() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24)
      const dailyReturn = (inv.amount * 0.5) / 30 // 50% monthly return = ~1.67% daily
      return sum + (dailyReturn * durationInDays)
    }, 0)

    // Generate random mining power based on investment amount
    const miningPower = totalInvested * (0.5 + Math.random()) / 100 // Random TH/s based on investment

    const stats = {
      balance: totalInvested + totalEarnings,
      activeInvestments: activeInvestments.length,
      totalEarnings,
      miningPower,
      hasActiveInvestment
    }

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}