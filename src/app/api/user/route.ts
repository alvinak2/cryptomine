// src/app/api/user/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    await User.findOneAndDelete({ email: session.user.email })

    return new Response('Account deleted successfully', { status: 200 })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}