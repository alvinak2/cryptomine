// src/app/api/admin/wallets/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Wallet } from '@/models/wallet'
import { validateWalletAddress } from '@/lib/validateWallet' // Add this import

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
      }

    await connectDB()
    const wallets = await Wallet.find({})
    return new Response(JSON.stringify(wallets), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
      }

    const { currency, address } = await req.json()
    if (!validateWalletAddress(currency, address)) {
      return new Response('Invalid wallet address', { status: 400 })
    }

    await connectDB()
    const wallet = await Wallet.create({ currency, address })
    
    return new Response(JSON.stringify(wallet), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}