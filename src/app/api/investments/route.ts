// src/app/api/investments/route.ts
import { NextResponse } from 'next/server'
import getServerSession from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

const INVESTMENT_PLANS = {
  BASIC: { minimum: 100, days: 30, return: 50 },
  PRO: { minimum: 500, days: 20, return: 50 },
  ELITE: { minimum: 1000, days: 10, return: 50 }
} as const

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, amount, walletType } = await req.json()
    
    // Validate investment plan
    const plan = INVESTMENT_PLANS[type as keyof typeof INVESTMENT_PLANS]
    if (!plan) {
      return NextResponse.json({ error: 'Invalid investment type' }, { status: 400 })
    }

    // Validate amount
    if (amount < plan.minimum) {
      return NextResponse.json({ 
        error: `Minimum investment for ${type} is $${plan.minimum}` 
      }, { status: 400 })
    }

    // Calculate dates and return amount
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + plan.days * 24 * 60 * 60 * 1000)
    const returnAmount = amount * (plan.return / 100)

    // Create investment record
    const investment = await prisma.investment.create({
      data: {
        type,
        amount,
        returnAmount,
        startDate,
        endDate,
        status: 'PENDING',
        userId: session.user.id
      }
    })

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        walletType,
        status: 'PENDING',
        investmentId: investment.id,
        userId: session.user.id
      }
    })

    return NextResponse.json({ 
      investment,
      payment,
      walletAddress: process.env[`${walletType}_WALLET_ADDRESS`]
    }, { status: 201 })

  } catch (error) {
    console.error('Investment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create investment' }, 
      { status: 500 }
    )
  }
}