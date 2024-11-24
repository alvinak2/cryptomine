// src/app/api/user/withdraw-request/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'
import { User } from '@/models/user'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const { investmentId, paymentMethod } = await req.json()
    if (!investmentId || !paymentMethod) {
      return new Response('Missing required fields', { status: 400 })
    }

    await connectDB()

    // Get user's wallet address
    const user = await User.findOne({ email: session.user.email })
    const walletAddress = user.walletAddresses?.[paymentMethod]

    if (!walletAddress) {
      return new Response('No wallet address found for selected payment method', { status: 400 })
    }

    const investment = await Investment.findByIdAndUpdate(
      investmentId,
      { 
        withdrawalRequested: true,
        withdrawalRequestDate: new Date(),
        withdrawalMethod: paymentMethod,
        withdrawalAddress: walletAddress
      },
      { new: true }
    )

    if (!investment) {
      return new Response('Investment not found', { status: 404 })
    }

    return new Response(JSON.stringify({
      success: true,
      investment,
      walletAddress
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Withdrawal request error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}