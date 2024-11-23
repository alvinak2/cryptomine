// src/app/api/dashboard/statistics/route.ts
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

    const investments = await Investment.find({
      userId: session.user.id
    }).sort({ createdAt: 1 })

    // Calculate total invested and returns
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const activeInvestments = investments.filter(inv => inv.status === 'active')
    const totalReturns = activeInvestments.reduce((sum, inv) => {
      const durationInDays = (Date.now() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24)
      const dailyReturn = (inv.amount * 0.5) / 30 // 50% monthly return
      return sum + (dailyReturn * durationInDays)
    }, 0)

    // Generate monthly data (last 6 months)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        returns: Math.random() * totalReturns / 6 // Simulated returns
      }
    }).reverse()

    // Calculate investment distribution
    const distribution = [
      investments.filter(inv => inv.plan === 'Basic').length,
      investments.filter(inv => inv.plan === 'Pro').length,
      investments.filter(inv => inv.plan === 'Elite').length
    ]

    const stats = {
      totalInvested,
      totalReturns,
      activeInvestments: activeInvestments.length,
      miningPower: totalInvested * (0.5 + Math.random()) / 100,
      monthlyData,
      investmentDistribution: distribution
    }

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}