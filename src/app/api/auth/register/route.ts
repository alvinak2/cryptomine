// src/app/api/auth/register/route.ts
import { connectDB } from '@/lib/db'
import { User } from '@/models/user'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    // First verify MongoDB connection
    try {
      await connectDB()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return new Response('Database connection failed', { status: 503 })
    }

    // Parse and validate request body
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      return new Response('Invalid request body', { status: 400 })
    }

    const { name, email, password } = body

    if (!name || !email || !password) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response('Invalid email format', { status: 400 })
    }

    // Check for existing user
    const existingUser = await User.findOne({ email }).select('email')
    if (existingUser) {
      return new Response('Email already exists', { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with error handling
    let user
    try {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        investments: [],
        walletAddresses: {},
        createdAt: new Date()
      })
    } catch (createError) {
      console.error('User creation error:', createError)
      return new Response('Failed to create user', { status: 500 })
    }

    return new Response(
      JSON.stringify({
        message: 'User created successfully',
        userId: user._id
      }), 
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}