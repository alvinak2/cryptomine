// src/app/api/investments/confirm-payment/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const { investmentId, paymentMethod } = await req.json()
    await connectDB()

    const investment = await Investment.findByIdAndUpdate(
      investmentId,
      { 
        paymentConfirmed: true,
        status: 'pending_verification',
        paymentMethod // Save payment method
      },
      { new: true }
    )

    if (!investment) {
      return new Response('Investment not found', { status: 404 })
    }

    return new Response(JSON.stringify(investment), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}