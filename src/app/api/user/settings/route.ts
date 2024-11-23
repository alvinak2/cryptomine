// src/app/api/user/settings/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    
    return new Response(JSON.stringify(user.settings), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const settings = await req.json()
    await connectDB()
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { settings } },
      { new: true }
    )

    return new Response(JSON.stringify(user.settings), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}