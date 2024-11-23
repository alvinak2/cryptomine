// src/app/api/user/password/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'
import bcrypt from 'bcryptjs'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return new Response('Missing required fields', { status: 400 })
    }

    if (newPassword.length < 6) {
      return new Response('Password must be at least 6 characters', { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return new Response('Current password is incorrect', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    await user.save()

    return new Response('Password updated successfully', { status: 200 })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}