// src/app/api/admin/users/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'

export async function GET(req: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    // Parse query parameters
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const sortField = url.searchParams.get('sortField') || 'createdAt'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    await connectDB()

    // Build query
    const query = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {}

    // Get total count for pagination
    const total = await User.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Fetch users with pagination and sorting
    const users = await User.find(query)
      .select('name email role createdAt')
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)

    return new Response(
      JSON.stringify({
        users,
        totalPages,
        currentPage: page,
        total
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    const id = req.url.split('/').pop()
    if (!id) {
      return new Response('User ID is required', { status: 400 })
    }

    await connectDB()
    await User.findByIdAndDelete(id)

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}