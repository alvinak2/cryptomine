// src/app/api/wallet/balance/route.ts
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
    
    // Mock wallet balances - in production, integrate with real crypto APIs
    const balances = {
      btc: Math.random() * 1,
      eth: Math.random() * 10,
      usdt: Math.random() * 1000,
      sol: Math.random() * 100
    }

    return new Response(JSON.stringify(balances), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}