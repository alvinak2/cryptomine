// src/app/api/investments/active/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    
    const activeInvestments = user.investments.filter(
      (inv: any) => inv.status === 'active'
    )

    return new Response(JSON.stringify({
      hasActive: activeInvestments.length > 0,
      activeInvestments,
      totalInvested: activeInvestments.reduce((sum: number, inv: any) => sum + inv.amount, 0),
      currentReturns: activeInvestments.reduce((sum: number, inv: any) => sum + inv.returns, 0)
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}