// src/app/api/investments/[id]/status/route.ts
import { NextResponse } from 'next/server'
import getServerSession from 'next-auth'
import { authOptions } from '@/lib/auth'
import PaymentService from '@/services/PaymentService'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const investment = await prisma.investment.findUnique({
      where: { id: params.id },
      include: { payment: true }
    })

    if (!investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 })
    }

    if (investment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (investment.payment?.status === 'PENDING') {
      const isVerified = await PaymentService.verifyPayment(investment.payment.id)
      if (isVerified) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: investment.payment.id },
            data: { status: 'CONFIRMED' }
          }),
          prisma.investment.update({
            where: { id: investment.id },
            data: { status: 'ACTIVE' }
          })
        ])
      }
    }

    return NextResponse.json({
      status: investment.status,
      paymentStatus: investment.payment?.status
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check investment status' },
      { status: 500 }
    )
  }
}