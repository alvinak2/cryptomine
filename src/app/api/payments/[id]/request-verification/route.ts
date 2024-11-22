// src/app/api/payments/[id]/request-verification/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { proof } = await req.json()

    const payment = await prisma.payment.update({
      where: {
        id: params.id,
        userId: session.user.id,
        status: 'PENDING'
      },
      data: {
        status: 'VERIFICATION_REQUESTED',
        proof,
        requestedAt: new Date()
      }
    })

    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to request verification' },
      { status: 500 }
    )
  }
}