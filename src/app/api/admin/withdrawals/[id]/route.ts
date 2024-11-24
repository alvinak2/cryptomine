// src/app/api/admin/withdrawals/[id]/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'
import { Transaction } from '@/models/transaction'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    const { status } = await req.json()
    if (!['approved', 'rejected'].includes(status)) {
      return new Response('Invalid status', { status: 400 })
    }

    await connectDB()

    const investment = await Investment.findById(params.id)
    if (!investment) {
      return new Response('Investment not found', { status: 404 })
    }

    if (status === 'approved') {
      // Calculate final returns based on plan rate
      const returnRate = investment.plan === 'Basic' ? 50 :
                        investment.plan === 'Pro' ? 50 : 50 // Elite
      const totalReturn = investment.amount * (1 + returnRate / 100)

      // Update investment status
      investment.status = 'completed'
      investment.withdrawalApproved = true
      investment.withdrawalApprovedDate = new Date()
      investment.returns = totalReturn - investment.amount
      await investment.save()

      // Record the transaction
      await Transaction.create({
        userId: investment.userId,
        investmentId: investment._id,
        type: 'withdrawal',
        amount: totalReturn,
        status: 'completed',
        paymentMethod: investment.withdrawalMethod,
        walletAddress: investment.withdrawalAddress,
        createdAt: new Date()
      })
    } else {
      // Reject withdrawal request
      investment.withdrawalRequested = false
      investment.withdrawalRejectedDate = new Date()
      await investment.save()
    }

    return new Response(JSON.stringify({
      success: true,
      status,
      investment
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Withdrawal approval error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}