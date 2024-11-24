// src/app/api/investments/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Investment } from '@/models/investment'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    const investments = await Investment.find({
      userId: session.user.id
    }).sort({ createdAt: -1 })

    return new Response(JSON.stringify(investments), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}