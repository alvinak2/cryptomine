// src/app/api/investments/[id]/withdraw/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    
    const investment = await Investment.findById(params.id)
    if (!investment) {
      return new Response('Investment not found', { status: 404 })
    }

    // Verify ownership and status
    if (investment.userId.toString() !== session.user.id || 
        investment.status !== 'active') {
      return new Response('Unauthorized', { status: 401 })
    }

    // Check if investment period is completed
    const now = new Date()
    const endDate = new Date(investment.endDate)
    if (now < endDate) {
      return new Response('Investment period not completed', { status: 400 })
    }

    // Update investment status
    investment.status = 'completed'
    await investment.save()

    return new Response(JSON.stringify(investment), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}