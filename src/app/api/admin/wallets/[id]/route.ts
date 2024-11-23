// At the top of src/app/api/admin/wallets/[id]/route.ts 
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { Wallet } from '@/models/wallet'
import { validateWalletAddress } from '@/lib/validateWallet' // Add this import

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    const { address } = await req.json()
    await connectDB()

    const wallet = await Wallet.findById(params.id)
    if (!wallet) {
      return new Response('Wallet not found', { status: 404 })
    }

    if (!validateWalletAddress(wallet.currency, address)) {
      return new Response('Invalid wallet address', { status: 400 })
    }

    wallet.address = address
    await wallet.save()

    return new Response(JSON.stringify(wallet), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}