// src/app/api/investments/purchase/route.ts
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { plan, amount } = await req.json()
    
    await connectDB()
    
    // Validate plan and amount
    if (!validateInvestment(plan, amount)) {
      return new Response('Invalid investment parameters', { status: 400 })
    }

    const user = await User.findOne({ email: session.user?.email })
    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    // Create new investment
    const investment = {
      plan,
      amount,
      status: 'pending',
      startDate: new Date(),
      endDate: calculateEndDate(plan),
      returns: 0
    }

    user.investments.push(investment)
    await user.save()

    return new Response(JSON.stringify(investment), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

function validateInvestment(plan: string, amount: number) {
  const minAmounts = {
    'Basic': 100,
    'Pro': 500,
    'Elite': 1000
  }
  return amount >= minAmounts[plan as keyof typeof minAmounts]
}

function calculateEndDate(plan: string) {
  const durations = {
    'Basic': 30,
    'Pro': 20,
    'Elite': 10
  }
  const date = new Date()
  date.setDate(date.getDate() + durations[plan as keyof typeof durations])
  return date
}