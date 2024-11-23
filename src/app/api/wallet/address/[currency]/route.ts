// src/app/api/wallet/address/[currency]/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Wallet } from '@/models/wallet'

export async function GET(
  req: Request,
  { params }: { params: { currency: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    
    const wallet = await Wallet.findOne({ 
      currency: params.currency.toLowerCase() 
    })

    if (!wallet) {
      return new Response('Wallet address not found', { status: 404 })
    }

    return new Response(
      JSON.stringify({ address: wallet.address }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Fetch wallet error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}