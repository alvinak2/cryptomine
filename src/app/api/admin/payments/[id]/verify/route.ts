// src/app/api/admin/payments/[id]/verify/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

type PaymentStatus = 'PENDING' | 'VERIFICATION_REQUESTED' | 'VERIFIED' | 'REJECTED'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, rejectionReason } = await req.json()
    const isApproved = action === 'approve'
    const newStatus: PaymentStatus = isApproved ? 'VERIFIED' : 'REJECTED'

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: params.id },
        data: {
          status: newStatus,
          verifiedAt: new Date(),
          verifiedBy: session.user.id,
          rejectionReason: !isApproved ? rejectionReason : null
        }
      })

      if (isApproved) {
        await tx.investment.update({
          where: { id: payment.investmentId },
          data: { status: 'ACTIVE' }
        })
      }

      return payment
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}