// src/app/api/wallet/route.ts
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user?.email })
    if (!user) return new Response('User not found', { status: 404 })

    return new Response(JSON.stringify(user.walletAddresses), { status: 200 })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const { type, address } = await req.json()
    if (!validateWalletAddress(type, address)) {
      return new Response('Invalid wallet address', { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user?.email })
    if (!user) return new Response('User not found', { status: 404 })

    user.walletAddresses = {
      ...user.walletAddresses,
      [type]: address
    }
    await user.save()

    return new Response(JSON.stringify(user.walletAddresses), { status: 200 })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}

function validateWalletAddress(type: string, address: string): boolean {
  const patterns = {
    btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    eth: /^0x[a-fA-F0-9]{40}$/,
    usdt: /^T[A-Za-z1-9]{33}$/,
    sol: /[1-9A-HJ-NP-Za-km-z]{32,44}$/
  }
  return patterns[type as keyof typeof patterns]?.test(address) ?? false
}