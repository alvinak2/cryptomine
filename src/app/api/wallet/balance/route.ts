// src/app/api/wallet/balance/route.ts
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

    const balances = await fetchWalletBalances(user.walletAddresses)
    return new Response(JSON.stringify(balances), { status: 200 })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}

async function fetchWalletBalances(addresses: Record<string, string>) {
  // Implement external API calls to fetch real balances
  // For demo, return mock data
  return Object.keys(addresses).reduce((acc, key) => ({
    ...acc,
    [key]: Math.random() * 100
  }), {})
}