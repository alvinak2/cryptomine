// src/app/api/admin/investments/[id]/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    const { status } = await req.json()
    await connectDB()

    const investment = await Investment.findByIdAndUpdate(
      params.id,
      { 
        status,
        ...(status === 'active' ? {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        } : {})
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