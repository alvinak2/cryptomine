// src/app/api/user/wallets/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    return new Response(JSON.stringify(user.walletAddresses || {}), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Fetch wallets error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const addresses = await req.json()
    await connectDB()

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { walletAddresses: addresses } },
      { new: true }
    )

    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    return new Response(JSON.stringify(user.walletAddresses), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Update wallets error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}